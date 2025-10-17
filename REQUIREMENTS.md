# System Requirements

## Prerequisites

Before running this project, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18.x or higher recommended)
   - Download from: https://nodejs.org/
   - Or install via nvm: https://github.com/nvm-sh/nvm

2. **npm** (comes with Node.js)
   - Version 9.x or higher recommended
   - Check version: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Project Dependencies

All project dependencies are managed through `package.json` and will be automatically installed when you run `npm install`.

### Main Dependencies
- **React** 18.3.1 - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router DOM** 6.30.1 - Routing
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - UI component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons
- **Recharts** - Charts and data visualization
- **TanStack React Query** - Data fetching
- **Sonner** - Toast notifications

For a complete list of dependencies, see `package.json`.

## Installation Steps

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install all dependencies
npm install

# Step 4: Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## System Compatibility

- **Operating System**: Windows, macOS, Linux
- **Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Minimum RAM**: 4GB (8GB recommended)
- **Disk Space**: ~500MB for node_modules

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, modify `vite.config.ts` to use a different port.

### Node Version Issues
Use nvm to switch Node versions:
```bash
nvm install 18
nvm use 18
```

### Dependency Installation Errors
Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Notes

- This is a **Node.js/React** project, not Python
- Dependencies are defined in `package.json` (Node.js equivalent of Python's requirements.txt)
- No database setup required - currently uses local state/mock data
- No environment variables required for basic functionality
