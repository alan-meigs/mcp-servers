# LibreChat MCP Server Setup Guide

This guide explains how to set up LibreChat with a Model Context Protocol (MCP) server, specifically the memory server implementation.

## Colima Setup (for macOS Users)

Colima is a container runtime tool that allows you to run container engines like Docker on macOS. It's a lightweight alternative to Docker Desktop.

### Quick Setup (Recommended)

The fastest way to get started is using the Colima scope group:

```bash
scope doctor run --only gusto/colima@v1
```

This initial setup typically takes 5-10 minutes. If you encounter any issues, check the troubleshooting section below.

### Manual Setup

1. Ensure Gusto Profile config is up to date:
```bash
cat ~/.colima/gusto/colima.yaml | grep -e vmType -e mountType
```

Expected output:
```
vmType: vz
mountType: virtiofs
```

2. Install required components:
```bash
# Install Gusto Homebrew tap
brew tap gusto/gusto

# Install gusto-lima service
brew install gusto-lima
```

3. Start Colima:
```bash
# Start Colima service and wait for it to be ready
brew services restart gusto-lima && sleep 180 && colima status gusto
```

4. Verify Colima is running:
```bash
colima status gusto
```

Expected output:
```
INFO[0000] colima [profile=gusto] is running using macOS Virtualization.Framework
INFO[0000] arch: aarch64
INFO[0000] runtime: docker
INFO[0000] mountType: virtiofs
INFO[0000] socket: unix:///Users/user.name/.colima/gusto/docker.sock
```

5. Set Docker context to use Colima:
```bash
docker context use colima-gusto
```

### Troubleshooting

If Colima isn't starting properly:

1. Check service status:
```bash
brew services list | grep gusto-lima
```

2. View logs:
```bash
cat /opt/homebrew/var/log/gusto.log
```

3. Common fixes:
```bash
# Restart the service
brew services restart gusto-lima

# Or stop and start
brew services stop gusto-lima
brew services start gusto-lima
```

Note: Do NOT uninstall Docker Desktop as it may cause issues with your local environment. Instead, just disable it to save resources.

### Troubleshooting Colima Issues

If you encounter issues with Colima not starting properly, follow these steps:

1. Check the service status:
```bash
brew services list | grep gusto-lima
```

2. View logs for detailed error information:
```bash
cat /opt/homebrew/var/log/gusto.log
```

3. If you see errors like "vz driver is running but host agent is not", try these steps:
```bash
# Stop and delete the existing Colima instance
colima stop gusto && colima delete gusto

# Restart the gusto-lima service
brew services restart gusto-lima

# Wait for the service to fully start (about 30 seconds)
sleep 30

# Verify Colima is running
colima status gusto
```

4. Verify Docker context is properly set:
```bash
docker context ls
```

Expected output should show:
- Colima running with macOS Virtualization.Framework
- Docker context set to colima-gusto
- Docker socket available at the expected location

If issues persist, you may need to:
1. Check for any conflicting Docker installations
2. Verify your system's virtualization capabilities
3. Ensure you have sufficient disk space and memory available

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed
- Git (to clone the repository)

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory with your API key:

```env
OPENAI_API_KEY=your_api_key_here
```

### 2. MCP Server Configuration

Create a `librechat.yaml` file in the root directory:

```yaml
version: 1.0.0

mcpServers:
  memory:
    type: stdio
    command: node
    args:
      - "/app/servers/memory/dist/index.js"
    env:
      MEMORY_FILE_PATH: /app/data/memory.json
```

### 3. Docker Compose Configuration

Modify your `docker-compose.yml` to include the necessary volume mounts:

```yaml
services:
  api:
    # ... other configurations ...
    volumes:
      - ./data:/app/data
      - ./servers/memory:/app/servers/memory
```

### 4. TypeScript Configuration

Create a `tsconfig.json` in your MCP server directory (e.g., `servers/memory/tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": ".",
    "skipLibCheck": true,
    "lib": [
      "ES2020",
      "DOM",
      "ES2022.Intl"
    ]
  },
  "include": [
    "*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 5. Build the MCP Server

Navigate to your MCP server directory and build it:

```bash
cd servers/memory
npm install
npm run build
```

### 6. Start LibreChat

From the root directory, start LibreChat using Docker Compose:

```bash
docker-compose up
```

## Important Notes

1. The `MEMORY_FILE_PATH` in `librechat.yaml` points to `/app/data/memory.json` inside the Docker container
2. The `servers/memory` directory is mounted to `/app/servers/memory` in the container
3. The `data` directory is mounted to `/app/data` in the container for persistent storage
4. Make sure to rebuild the MCP server if you make any changes to the TypeScript code

## Troubleshooting

- If you encounter TypeScript errors, ensure your `tsconfig.json` is properly configured
- Verify that all volume mounts in `docker-compose.yml` are correct
- Check that the paths in `librechat.yaml` match your Docker container structure
- Ensure the `data` directory exists and has proper permissions
