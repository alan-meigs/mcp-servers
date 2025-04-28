# Todoodles - Time-Stamped Todo List MCP Server

A charming and extensible MCP server for managing time-stamped todoodle items. Built with TypeScript and the Model Context Protocol, designed for integration with LibreChat.
https://github.com/Drakosfire/Sizzek/tree/main/mcp-servers/todoodles

## System Architecture

### Core Components

1. **TodoodleListManager Class**
   - Manages todoodle state and persistence
   - Handles sequential ID generation (starting from 1)
   - Implements CRUD operations for todoodles
   - Maintains chronological ordering

2. **Data Model**
   ```typescript
   interface TodoodleItem {
       id: string;           // Sequential numeric ID
       text: string;         // Todoodle content
       createdAt: string;    // ISO timestamp
       completed: boolean;   // Completion status
       completedAt?: string; // Completion timestamp
       timeToComplete?: number; // Time taken in milliseconds
   }
   ```

3. **MCP Server Framework**
   - Uses ModelContextProtocol SDK
   - Implements stdio transport
   - Defines clear tool schemas
   - Handles request/response lifecycle

### Features

- **Todoodle Management**
  - Add new todoodles with automatic timestamps
  - Mark todoodles as completed with time tracking
  - Sequential ID generation (1, 2, 3, ...)
  - Chronological ordering (newest first)
  - Search todoodles by text content
  - Complete todoodles by ID or text search

- **Viewing Options**
  - Today's todoodles
  - All todoodles
  - Incomplete todoodles
  - Completion status and timing

- **Persistence**
  - Automatic saving to todoodle.json
  - File-based storage
  - Error handling for missing files
  - Data integrity maintenance

## Integration

### LibreChat Configuration
```yaml
mcpServers:
  todoodles:
    type: stdio
    command: node
    args:
      - "/app/mcp-servers/todoodles/dist/index.js"
    timeout: 30000
    initTimeout: 10000
    env:
        TODOS_FILE_PATH: "/app/data/todoodles.json"
    stderr: inherit
```

### Docker Volume Mapping
```yaml
volumes:
  - ../Sizzek/mcp-servers:/app/mcp-servers
  - ../Sizzek/memory_files:/app/data
```

## API Tools

1. **add_todoodle**
   ```json
   {
     "name": "add_todoodle",
     "arguments": {
       "text": "Task description"
     }
   }
   ```

2. **get_today_todoodles**
   ```json
   {
     "name": "get_today_todoodles",
     "arguments": {}
   }
   ```

3. **get_all_todoodles**
   ```json
   {
     "name": "get_all_todoodles",
     "arguments": {}
   }
   ```

4. **get_incomplete_todoodles**
   ```json
   {
     "name": "get_incomplete_todoodles",
     "arguments": {}
   }
   ```

5. **complete_todoodle**
   ```json
   {
     "name": "complete_todoodle",
     "arguments": {
       "id": "1"
     }
   }
   ```

6. **search_todoodles**
   ```json
   {
     "name": "search_todoodles",
     "arguments": {
       "query": "search text"
     }
   }
   ```

7. **complete_todoodle_by_text**
   ```json
   {
     "name": "complete_todoodle_by_text",
     "arguments": {
       "text": "search text"
     }
   }
   ```

## Development Setup

1. **Installation**
   ```bash
   npm install
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Run**
   ```bash
   npm start
   ```

## Implementation Notes

### ID Management
- Sequential numeric IDs starting from 1
- IDs persist between server restarts
- Automatic ID incrementation
- String representation for consistency

### Time Tracking
- Creation timestamps in ISO format
- Completion timestamps when marked done
- Time-to-complete calculation in milliseconds
- Human-readable duration display

### Error Handling
- Graceful file system error handling
- Null returns for invalid operations
- Clear error messages
- State consistency maintenance

## Next Steps

1. **Core Features**
   - Build out a system for saving user-specific memory files
   - Organize todoodles into projects
   - Add todoodle categories and tags
   - Implement priority levels
   - Add due dates and reminders
   - Support recurring todoodles
   - Create todoodle templates

2. **Agent Integration**
   - Enable AI agents to create and manage their own todoodles
   - Allow agents to track their own tasks and progress
   - Implement agent-specific task prioritization
   - Create agent memory persistence through todoodles
   - Develop agent task delegation capabilities
   - Enable agent-to-agent task sharing
   - Implement agent task completion verification
   - Create agent performance analytics through task tracking

3. **User Experience**
   - Add ASCII art representation of todoodles
   - Implement simple animation for completion
   - Create visual progress indicators
   - Add emoji-based status indicators
   - Interactive CLI interface
   - Rich text formatting
   - Customizable themes
   - Keyboard shortcuts

4. **Integration & Collaboration**
   - Calendar integration
   - Email notifications
   - Mobile app companion
   - Web interface
   - Multi-user support
   - Sharing capabilities
   - Team collaboration features

5. **Advanced Features**
   - Todoodle dependencies
   - Progress tracking
   - Time estimates
   - Analytics and reporting
   - Export/Import functionality
   - Backup and restore
   - Version history
   - Search and filtering enhancements

## License

ISC 
https://en.wikipedia.org/wiki/ISC_license
Copyright 2025 Alan Meigs

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.