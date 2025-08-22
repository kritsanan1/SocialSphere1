
# Scripts Documentation

This document provides detailed information about all available npm scripts in the SocialAI project.

## Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with hot reload | None | `npm run dev` | **Port 5000 in use:** Kill process with `lsof -i :5000` then `kill -9 <PID>` |
| `build` | Build production bundle | None | `npm run build` | **Build fails:** Clear node_modules and reinstall dependencies |
| `start` | Start production server | None | `npm run start` | **Server won't start:** Check environment variables and database connection |
| `check` | Run TypeScript type checking | None | `npm run check` | **Type errors:** Review TypeScript configurations and fix type issues |
| `db:push` | Push database schema to Neon | None | `npm run db:push` | **Connection failed:** Verify DATABASE_URL in environment variables |
| `test` | Run all test suites | `[pattern]` | `npm test login` | **Tests failing:** Run `npm run test:reset` to clear test cache |
| `test:watch` | Run tests in watch mode | `[pattern]` | `npm run test:watch` | **Watch not triggering:** Check file permissions and disable antivirus scanning |
| `test:coverage` | Generate test coverage report | None | `npm run test:coverage` | **Low coverage:** Add tests for uncovered files shown in report |
| `lint` | Run ESLint code linting | `[--fix]` | `npm run lint --fix` | **Linting errors:** Review .eslintrc rules and fix code style issues |
| `format` | Format code with Prettier | None | `npm run format` | **Formatting conflicts:** Check .prettierrc configuration |

## Detailed Script Information

### Development Scripts

#### `npm run dev`
**Purpose:** Starts the development server with hot module replacement and file watching.

**What it does:**
- Compiles TypeScript files using tsx
- Starts Express server on port 5000
- Enables Vite dev server for frontend
- Watches for file changes and auto-reloads
- Sets NODE_ENV to development

**Expected Output:**
```bash
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

7:28:42 PM [express] serving on port 5000
```

**Common Issues:**
- **Port already in use:** Another process is using port 5000
  ```bash
  # Find and kill the process
  lsof -i :5000
  kill -9 <PID>
  ```
- **Module not found:** Missing dependencies
  ```bash
  npm install
  ```
- **Permission denied:** File permissions issue
  ```bash
  chmod +x server/index.ts
  ```

#### `npm run build`
**Purpose:** Creates optimized production build for deployment.

**Build Process:**
1. Compiles client-side React app with Vite
2. Bundles server-side code with esbuild
3. Outputs to `dist/` directory
4. Optimizes assets and removes development code

**Expected Output:**
```bash
✓ built in 2.5s
dist/
├── client/
│   ├── assets/
│   └── index.html
└── server/
    └── index.js
```

**Troubleshooting:**
- **Build fails with TypeScript errors:** Run `npm run check` first
- **Out of memory:** Increase Node.js memory limit
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run build
  ```

### Production Scripts

#### `npm run start`
**Purpose:** Runs the production server using built files.

**Prerequisites:**
- Run `npm run build` first
- Set NODE_ENV=production
- Configure production environment variables

**Expected Behavior:**
- Serves static files from `dist/client/`
- Runs API server from `dist/server/index.js`
- Uses production database connection
- Enables production optimizations

### Database Scripts

#### `npm run db:push`
**Purpose:** Synchronizes database schema with Drizzle ORM definitions.

**What it does:**
- Reads schema from `server/db.ts`
- Generates SQL migration commands
- Applies changes to Neon PostgreSQL database
- Updates table structures and relationships

**Expected Output:**
```bash
📦 Schema changes detected:
✓ Created table "users"
✓ Created table "social_profiles"
✓ Applied 5 changes
```

**Common Errors:**
- **Connection refused:** Check DATABASE_URL
- **Permission denied:** Verify database credentials
- **Schema conflicts:** Review migration files for conflicts

### Testing Scripts

#### `npm test`
**Purpose:** Executes all test suites using Vitest.

**Test Categories:**
- **Unit Tests:** Individual component testing
- **Integration Tests:** API endpoint testing
- **Service Tests:** External service mocking

**Coverage Targets:**
- Statements: 80%+
- Branches: 75%+
- Functions: 85%+
- Lines: 80%+

**Running Specific Tests:**
```bash
# Test specific file
npm test login-form.test.tsx

# Test specific pattern
npm test -- --testNamePattern="should render"

# Test with verbose output
npm test -- --verbose
```

#### `npm run test:watch`
**Purpose:** Runs tests continuously, re-executing when files change.

**Useful for:**
- Test-driven development (TDD)
- Immediate feedback during development
- Debugging specific test cases

**Watch Mode Commands:**
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename pattern
- `q` - Quit watch mode

### Code Quality Scripts

#### `npm run lint`
**Purpose:** Analyzes code for style and quality issues using ESLint.

**Linting Rules:**
- TypeScript best practices
- React hooks rules
- Import/export conventions
- Code formatting standards

**Auto-fixing:**
```bash
# Fix automatically resolvable issues
npm run lint -- --fix

# Check specific files
npm run lint -- src/components/**/*.tsx
```

**Common Warnings:**
- Unused imports
- Missing dependencies in useEffect
- Inconsistent naming conventions
- Missing TypeScript types

### Utility Scripts

#### `npm run check`
**Purpose:** Performs TypeScript type checking without emitting files.

**Benefits:**
- Fast type validation
- Catches type errors early
- Verifies interface compliance
- Validates generic constraints

**Integration with CI/CD:**
```bash
# In GitHub Actions
- name: Type Check
  run: npm run check
```

## Script Dependencies

### Environment Variables Required

| Script | Required Variables | Optional Variables |
|--------|-------------------|-------------------|
| `dev` | `DATABASE_URL` | `PORT`, `JWT_SECRET` |
| `start` | `DATABASE_URL`, `NODE_ENV` | `PORT` |
| `db:push` | `DATABASE_URL` | None |
| `test` | None | `NODE_ENV` |

### File Dependencies

| Script | Dependencies | Generated Files |
|--------|-------------|----------------|
| `build` | `src/**`, `server/**` | `dist/**` |
| `db:push` | `server/db.ts`, `drizzle.config.ts` | Database tables |
| `test` | `tests/**`, `src/**` | Coverage reports |

## Performance Optimization

### Development Performance
```bash
# Use faster TypeScript compilation
npm run dev -- --transpile-only

# Skip type checking in development
npm run dev -- --no-check
```

### Build Performance
```bash
# Parallel building
npm run build -- --parallel

# Skip source maps for faster builds
npm run build -- --no-sourcemap
```

## Custom Script Examples

### Running Multiple Scripts
```bash
# Run tests and linting in parallel
npm run test & npm run lint

# Run build after successful tests
npm test && npm run build
```

### Environment-Specific Scripts
```bash
# Development with debug logging
DEBUG=* npm run dev

# Production build with verbose output
VERBOSE=true npm run build
```

### Integration with Git Hooks
```bash
# Pre-commit hook
#!/bin/sh
npm run lint && npm test
```

This scripts documentation provides comprehensive information for developers to effectively use all available project scripts with proper troubleshooting guidance.
