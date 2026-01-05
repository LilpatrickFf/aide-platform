# AIDE - Autonomous Integrated Development Environment

A full-stack AI-powered development environment that enables autonomous agents to build, test, and deploy web applications based on natural language prompts.

## Overview

AIDE is a comprehensive platform that combines intelligent agent orchestration with a modern development interface. It features a multi-agent system (Planner, Coder, Verifier, Executor) that works together to transform user requirements into fully functional applications.

## Key Features

### 1. Project Management
- Create and manage multiple projects
- Track project status and metadata
- Organize files in a hierarchical structure
- Build history and deployment tracking

### 2. Three-Panel Development Interface
- **File Explorer**: Navigate and manage project files
- **Code Editor**: Edit code with syntax highlighting
- **Terminal & Preview**: Execute commands and view live previews

### 3. Multi-Agent System
- **Planner Agent**: Analyzes requirements and creates development plans
- **Coder Agent**: Generates implementation code using DeepSeek Coder
- **Verifier Agent**: Validates code quality and identifies issues
- **Executor Agent**: Executes tasks and manages deployment

### 4. Long-Term Memory System
- Vector-based semantic search for lessons and solutions
- Stores preferences, errors, and best practices
- Context-aware memory retrieval for tasks
- Memory analytics dashboard

### 5. Real-Time Collaboration
- WebSocket-based terminal for live output
- Automatic port routing for live previews
- Build progress tracking
- Deployment status monitoring

## Architecture

### Database Schema

The platform uses MySQL with Drizzle ORM for data persistence:

- **users**: Core user authentication and profile
- **projects**: User projects and metadata
- **projectFiles**: Project file structure and content
- **buildHistory**: Build and deployment records
- **agentMemory**: Stored lessons, preferences, and solutions
- **agentTasks**: Agent task execution tracking

### Backend Services

- **aideService.ts**: Core CRUD operations for projects, files, and memory
- **aideRouters.ts**: tRPC API endpoints with authentication
- **agentOrchestrator.ts**: Multi-agent orchestration and coordination
- **memorySystem.ts**: Vector storage and semantic search

### Frontend Components

- **AIDEDashboard.tsx**: Main three-panel UI layout
- **FileExplorer.tsx**: File tree navigation
- **CodeEditor.tsx**: Syntax-highlighted code editing
- **Terminal.tsx**: Command execution interface
- **LivePreview.tsx**: Application preview iframe

## API Endpoints

### Projects Router
- `projects.list` - Get all user projects
- `projects.create` - Create new project
- `projects.get` - Get project details
- `projects.update` - Update project metadata
- `projects.delete` - Delete project

### Files Router
- `files.list` - List project files
- `files.get` - Get file content
- `files.createOrUpdate` - Create or update file
- `files.delete` - Delete file

### Build History Router
- `buildHistory.list` - Get build records
- `buildHistory.create` - Create build record
- `buildHistory.update` - Update build status

### Agent Memory Router
- `agentMemory.list` - Retrieve memories
- `agentMemory.store` - Store new memory
- `agentMemory.update` - Update memory
- `agentMemory.delete` - Delete memory

### Agent Tasks Router
- `agentTasks.list` - Get agent tasks
- `agentTasks.create` - Create new task
- `agentTasks.get` - Get task details
- `agentTasks.update` - Update task status

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- Google Gemini Pro API key
- Hugging Face API token (for DeepSeek Coder)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/aide-platform.git
cd aide-platform
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API keys and database URL
```

4. Initialize database
```bash
pnpm db:push
```

5. Start development server
```bash
pnpm dev
```

6. Build for production
```bash
pnpm build
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/aide

# Authentication
JWT_SECRET=your-secret-key
OAUTH_SERVER_URL=https://api.manus.im

# AI APIs
GOOGLE_API_KEY=your-google-gemini-key
HUGGING_FACE_API_KEY=your-hugging-face-token

# Frontend
VITE_APP_TITLE=AIDE Platform
VITE_APP_LOGO=/logo.png
```

## Usage

### Creating a Project

1. Navigate to the dashboard
2. Click "New Project"
3. Enter project name and description
4. Click "Create"

### Using the Agent System

1. Open a project
2. Click "Run" to trigger the agent orchestration
3. Watch as Planner, Coder, Verifier, and Executor agents work together
4. View results in the Terminal panel

### Managing Memory

1. Access Memory tab in the sidebar
2. View stored lessons and solutions
3. Search for relevant memories using semantic search
4. Add new memories manually or through agent execution

## Development

### Project Structure

```
aide-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend services
│   ├── aideService.ts     # Core business logic
│   ├── aideRouters.ts     # tRPC API routes
│   ├── agentOrchestrator.ts # Agent coordination
│   ├── memorySystem.ts    # Memory management
│   └── _core/             # Framework utilities
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── README.md              # This file
```

### Adding New Features

1. Update database schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Add query helpers in `server/db.ts`
4. Create tRPC procedures in `server/routers.ts`
5. Build UI components in `client/src/`
6. Write tests in `server/*.test.ts`

## Testing

Run the test suite:
```bash
pnpm test
```

Run specific tests:
```bash
pnpm test server/auth.logout.test.ts
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the application
```bash
pnpm build
```

2. Start production server
```bash
pnpm start
```

## Performance Optimization

- Code splitting and lazy loading
- Database query optimization with indexes
- Caching strategies for frequently accessed data
- Vector embedding caching for memory searches
- CDN integration for static assets

## Security

- Authentication via OAuth
- Protected API endpoints with `protectedProcedure`
- SQL injection prevention through ORM
- CORS configuration
- Environment variable protection
- Rate limiting on API endpoints

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check MySQL server is running
- Ensure database user has proper permissions

### Agent Execution Failures
- Verify API keys are valid
- Check network connectivity
- Review agent logs in terminal
- Check memory usage

### Build Errors
- Clear node_modules and reinstall: `pnpm install`
- Check TypeScript errors: `pnpm check`
- Review build logs for specific errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/aide-platform/issues
- Documentation: https://aide-platform.dev/docs
- Email: support@aide-platform.dev

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced debugging tools
- [ ] Performance profiling
- [ ] Custom agent creation
- [ ] Plugin system
- [ ] Mobile app
- [ ] Enterprise features

## Acknowledgments

Built with modern web technologies:
- React 19 for UI
- TypeScript for type safety
- Drizzle ORM for database
- tRPC for type-safe APIs
- Tailwind CSS for styling
- Google Gemini Pro for AI planning
- DeepSeek Coder for code generation
