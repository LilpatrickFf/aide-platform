# AIDE Platform - API Documentation

Complete API reference for the AIDE platform tRPC endpoints.

## Authentication

All endpoints require authentication via OAuth. Include the session cookie in requests:
```
Cookie: manus-session=<session-token>
```

## Base URL

```
https://aide-platform.dev/api/trpc
```

## Error Handling

All errors follow this format:
```json
{
  "error": {
    "code": "UNAUTHORIZED|FORBIDDEN|NOT_FOUND|INTERNAL_SERVER_ERROR",
    "message": "Error description"
  }
}
```

## Projects API

### List Projects

Get all projects for the current user.

**Endpoint**: `projects.list`

**Method**: GET

**Request**:
```typescript
trpc.projects.list.useQuery()
```

**Response**:
```json
{
  "projects": [
    {
      "id": 1,
      "userId": 1,
      "name": "My Project",
      "description": "Project description",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Project

Create a new project.

**Endpoint**: `projects.create`

**Method**: POST

**Request**:
```typescript
trpc.projects.create.useMutation({
  name: "New Project",
  description: "Optional description"
})
```

**Response**:
```json
{
  "id": 2,
  "userId": 1,
  "name": "New Project",
  "description": "Optional description",
  "status": "active",
  "createdAt": "2024-01-02T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

### Get Project

Get details for a specific project.

**Endpoint**: `projects.get`

**Method**: GET

**Request**:
```typescript
trpc.projects.get.useQuery({ projectId: 1 })
```

**Response**:
```json
{
  "id": 1,
  "userId": 1,
  "name": "My Project",
  "description": "Project description",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Project

Update project metadata.

**Endpoint**: `projects.update`

**Method**: PATCH

**Request**:
```typescript
trpc.projects.update.useMutation({
  projectId: 1,
  name: "Updated Name",
  status: "completed"
})
```

**Response**:
```json
{ "success": true }
```

### Delete Project

Delete a project and all related data.

**Endpoint**: `projects.delete`

**Method**: DELETE

**Request**:
```typescript
trpc.projects.delete.useMutation({ projectId: 1 })
```

**Response**:
```json
{ "success": true }
```

## Files API

### List Files

Get all files in a project.

**Endpoint**: `files.list`

**Method**: GET

**Request**:
```typescript
trpc.files.list.useQuery({ projectId: 1 })
```

**Response**:
```json
{
  "files": [
    {
      "id": 1,
      "projectId": 1,
      "path": "src/index.ts",
      "fileType": "typescript",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get File

Get file content.

**Endpoint**: `files.get`

**Method**: GET

**Request**:
```typescript
trpc.files.get.useQuery({
  projectId: 1,
  path: "src/index.ts"
})
```

**Response**:
```json
{
  "id": 1,
  "projectId": 1,
  "path": "src/index.ts",
  "content": "export function hello() { ... }",
  "fileType": "typescript",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create or Update File

Create a new file or update existing file content.

**Endpoint**: `files.createOrUpdate`

**Method**: POST/PUT

**Request**:
```typescript
trpc.files.createOrUpdate.useMutation({
  projectId: 1,
  path: "src/index.ts",
  content: "export function hello() { ... }",
  fileType: "typescript"
})
```

**Response**:
```json
{ "success": true }
```

### Delete File

Delete a file.

**Endpoint**: `files.delete`

**Method**: DELETE

**Request**:
```typescript
trpc.files.delete.useMutation({
  projectId: 1,
  path: "src/index.ts"
})
```

**Response**:
```json
{ "success": true }
```

## Build History API

### List Builds

Get build history for a project.

**Endpoint**: `buildHistory.list`

**Method**: GET

**Request**:
```typescript
trpc.buildHistory.list.useQuery({ projectId: 1 })
```

**Response**:
```json
{
  "builds": [
    {
      "id": 1,
      "projectId": 1,
      "buildNumber": 1,
      "status": "success",
      "output": "Build completed successfully",
      "deploymentUrl": "https://example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "completedAt": "2024-01-01T00:01:00Z"
    }
  ]
}
```

### Create Build

Create a new build record.

**Endpoint**: `buildHistory.create`

**Method**: POST

**Request**:
```typescript
trpc.buildHistory.create.useMutation({
  projectId: 1,
  buildNumber: 1
})
```

**Response**:
```json
{
  "success": true,
  "buildId": 1
}
```

### Update Build

Update build status and results.

**Endpoint**: `buildHistory.update`

**Method**: PATCH

**Request**:
```typescript
trpc.buildHistory.update.useMutation({
  buildId: 1,
  projectId: 1,
  status: "success",
  output: "Build output",
  deploymentUrl: "https://example.com"
})
```

**Response**:
```json
{ "success": true }
```

## Agent Memory API

### List Memories

Retrieve stored memories with optional filtering.

**Endpoint**: `agentMemory.list`

**Method**: GET

**Request**:
```typescript
trpc.agentMemory.list.useQuery({
  projectId: 1,
  memoryType: "lesson"
})
```

**Response**:
```json
{
  "memories": [
    {
      "id": 1,
      "userId": 1,
      "projectId": 1,
      "memoryType": "lesson",
      "key": "typescript-best-practices",
      "value": "Always use strict mode and proper typing",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Store Memory

Store a new memory entry.

**Endpoint**: `agentMemory.store`

**Method**: POST

**Request**:
```typescript
trpc.agentMemory.store.useMutation({
  projectId: 1,
  memoryType: "lesson",
  key: "typescript-best-practices",
  value: "Always use strict mode and proper typing",
  embedding: "[0.1, 0.2, ...]"
})
```

**Response**:
```json
{
  "success": true,
  "memoryId": 1
}
```

### Update Memory

Update an existing memory entry.

**Endpoint**: `agentMemory.update`

**Method**: PATCH

**Request**:
```typescript
trpc.agentMemory.update.useMutation({
  memoryId: 1,
  value: "Updated memory value"
})
```

**Response**:
```json
{ "success": true }
```

### Delete Memory

Delete a memory entry.

**Endpoint**: `agentMemory.delete`

**Method**: DELETE

**Request**:
```typescript
trpc.agentMemory.delete.useMutation({ memoryId: 1 })
```

**Response**:
```json
{ "success": true }
```

## Agent Tasks API

### List Tasks

Get agent tasks for a project.

**Endpoint**: `agentTasks.list`

**Method**: GET

**Request**:
```typescript
trpc.agentTasks.list.useQuery({
  projectId: 1,
  status: "completed"
})
```

**Response**:
```json
{
  "tasks": [
    {
      "id": 1,
      "projectId": 1,
      "agentType": "planner",
      "status": "completed",
      "prompt": "Create a React component",
      "result": "Component created successfully",
      "createdAt": "2024-01-01T00:00:00Z",
      "completedAt": "2024-01-01T00:01:00Z"
    }
  ]
}
```

### Create Task

Create a new agent task.

**Endpoint**: `agentTasks.create`

**Method**: POST

**Request**:
```typescript
trpc.agentTasks.create.useMutation({
  projectId: 1,
  agentType: "planner",
  prompt: "Create a React component"
})
```

**Response**:
```json
{
  "success": true,
  "taskId": 1
}
```

### Get Task

Get details for a specific task.

**Endpoint**: `agentTasks.get`

**Method**: GET

**Request**:
```typescript
trpc.agentTasks.get.useQuery({
  taskId: 1,
  projectId: 1
})
```

**Response**:
```json
{
  "id": 1,
  "projectId": 1,
  "agentType": "planner",
  "status": "completed",
  "prompt": "Create a React component",
  "result": "Component created successfully",
  "createdAt": "2024-01-01T00:00:00Z",
  "completedAt": "2024-01-01T00:01:00Z"
}
```

### Update Task

Update task status and results.

**Endpoint**: `agentTasks.update`

**Method**: PATCH

**Request**:
```typescript
trpc.agentTasks.update.useMutation({
  taskId: 1,
  projectId: 1,
  status: "completed",
  result: "Task completed successfully"
})
```

**Response**:
```json
{ "success": true }
```

## Rate Limiting

API endpoints are rate limited:
- 100 requests per minute for authenticated users
- 10 requests per minute for public endpoints

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Pagination

List endpoints support pagination:
```typescript
trpc.projects.list.useQuery({
  page: 1,
  limit: 10
})
```

## Filtering

Filtering syntax:
```typescript
trpc.projects.list.useQuery({
  filter: {
    status: "active",
    createdAfter: "2024-01-01"
  }
})
```

## Sorting

Sorting syntax:
```typescript
trpc.projects.list.useQuery({
  sort: {
    field: "createdAt",
    direction: "desc"
  }
})
```

## WebSocket Events

Real-time updates via WebSocket:

```typescript
// Terminal output
socket.on("terminal:output", (data) => {
  console.log(data.output);
});

// Build progress
socket.on("build:progress", (data) => {
  console.log(`Build ${data.progress}% complete`);
});

// Agent status
socket.on("agent:status", (data) => {
  console.log(`Agent ${data.agentType} is ${data.status}`);
});
```

## Examples

### Complete Workflow

```typescript
// 1. Create project
const project = await trpc.projects.create.mutate({
  name: "My App",
  description: "A new application"
});

// 2. Create files
await trpc.files.createOrUpdate.mutate({
  projectId: project.id,
  path: "src/index.ts",
  content: "export function main() { ... }"
});

// 3. Create agent task
const task = await trpc.agentTasks.create.mutate({
  projectId: project.id,
  agentType: "planner",
  prompt: "Create a React component"
});

// 4. Monitor task
const result = await trpc.agentTasks.get.useQuery({
  taskId: task.taskId,
  projectId: project.id
});

// 5. Store memory
await trpc.agentMemory.store.mutate({
  projectId: project.id,
  memoryType: "solution",
  key: "react-component",
  value: "Successfully created component"
});
```
