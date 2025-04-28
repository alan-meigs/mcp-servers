#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class DateTimeManager {
    private getFiscalYear(date: Date): number {
        const fiscalYearStart = new Date(date.getFullYear(), 4, 1); // May 1st
        if (date < fiscalYearStart) {
            return date.getFullYear();
        }
        return date.getFullYear() + 1;
    }

    private getFiscalQuarter(date: Date): number {
        const month = date.getMonth();
        // Fiscal quarters: Q1 (May-Jul), Q2 (Aug-Oct), Q3 (Nov-Jan), Q4 (Feb-Apr)
        if (month >= 4 && month <= 6) return 1; // May-July
        if (month >= 7 && month <= 9) return 2; // Aug-Oct
        if (month >= 10 || month <= 0) return 3; // Nov-Jan
        return 4; // Feb-Apr
    }

    private getCurrentWorkingWeek(): Date[] {
        const today = new Date();
        const workingWeek: Date[] = [];

        // Get Monday of current week
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);

        // Add Monday through Friday
        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            workingWeek.push(day);
        }

        return workingWeek;
    }

    async getToday(): Promise<{
        date: string;
        fiscalYear: number;
        fiscalQuarter: number;
    }> {
        const today = new Date();
        return {
            date: today.toISOString().split('T')[0],
            fiscalYear: this.getFiscalYear(today),
            fiscalQuarter: this.getFiscalQuarter(today)
        };
    }

    async getWorkingWeek(): Promise<{
        days: Array<{
            date: string;
            fiscalYear: number;
            fiscalQuarter: number;
        }>;
    }> {
        const week = this.getCurrentWorkingWeek();
        return {
            days: week.map(date => ({
                date: date.toISOString().split('T')[0],
                fiscalYear: this.getFiscalYear(date),
                fiscalQuarter: this.getFiscalQuarter(date)
            }))
        };
    }
}

const datetimeManager = new DateTimeManager();
const server = new Server({
    name: "datetime-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_today",
                description: "Get today's date with fiscal year and quarter information",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            },
            {
                name: "get_working_week",
                description: "Get the current working week (Monday-Friday) with fiscal year and quarter information",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;

    switch (name) {
        case "get_today":
            return { content: [{ type: "text", text: JSON.stringify(await datetimeManager.getToday(), null, 2) }] };
        case "get_working_week":
            return { content: [{ type: "text", text: JSON.stringify(await datetimeManager.getWorkingWeek(), null, 2) }] };
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("DateTime MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
}); 