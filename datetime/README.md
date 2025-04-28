# DateTime MCP Server

A Model Context Protocol (MCP) server that provides datetime-related functionality for LibreChat.

## Features

- Get today's date with fiscal year and quarter information
- Get the current working week (Monday-Friday) with fiscal year and quarter information

## Fiscal Calendar

The server uses a fiscal calendar with the following characteristics:
- Fiscal Year starts on May 1st
- Fiscal Quarters:
  - Q1: May-July
  - Q2: August-October
  - Q3: November-January
  - Q4: February-April

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

## Usage

Start the server:
```bash
npm start
```

The server will run on stdio and can be used by LibreChat to access datetime information.

## Available Tools

### get_today

Returns today's date along with fiscal year and quarter information.

Example response:
```json
{
  "date": "2024-04-16",
  "fiscalYear": 2024,
  "fiscalQuarter": 4
}
```

### get_working_week

Returns the current working week (Monday-Friday) with fiscal year and quarter information for each day.

Example response:
```json
{
  "days": [
    {
      "date": "2024-04-15",
      "fiscalYear": 2024,
      "fiscalQuarter": 4
    },
    {
      "date": "2024-04-16",
      "fiscalYear": 2024,
      "fiscalQuarter": 4
    },
    {
      "date": "2024-04-17",
      "fiscalYear": 2024,
      "fiscalQuarter": 4
    },
    {
      "date": "2024-04-18",
      "fiscalYear": 2024,
      "fiscalQuarter": 4
    },
    {
      "date": "2024-04-19",
      "fiscalYear": 2024,
      "fiscalQuarter": 4
    }
  ]
}
``` 