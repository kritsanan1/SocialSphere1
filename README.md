
# SocialAI - AI-Powered Social Media Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

SocialAI is a comprehensive social media management platform that enables users to manage multiple social media accounts across 13+ platforms through a unified dashboard. Built with React, Express, and PostgreSQL, it integrates with the Ayrshare API to provide posting, scheduling, analytics, and engagement features.

## ✨ Features

- **Multi-Platform Management** - Support for 13+ social networks including Twitter, Facebook, Instagram, LinkedIn
- **Unified Dashboard** - Real-time analytics, engagement metrics, and performance insights
- **Content Scheduling** - Advanced calendar-based content planning and automated posting
- **Media Management** - Upload and organize photos, videos, and other media assets
- **Analytics & Insights** - Comprehensive performance tracking and audience analytics
- **Direct Messaging** - Manage social media messages across platforms
- **Comment Management** - Monitor and respond to comments from a single interface
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing

## 🛠 Technical Requirements

### System Prerequisites
- **Node.js**: >= 20.0.0 (LTS recommended)
- **npm**: >= 9.0.0 or **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 16.0 (via Neon serverless)
- **Git**: >= 2.34.0

### Development Environment
- **Operating System**: Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 2GB free space
- **Browser**: Chrome 100+, Firefox 98+, Safari 15+, or Edge 100+

## 🚀 Installation Guide

### 1. Clone Repository
```bash
git clone https://github.com/your-org/socialai.git
cd socialai
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following environment variables:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
NEON_DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Ayrshare API
AYRSHARE_API_KEY="your-ayrshare-api-key"
AYRSHARE_DOMAIN_ID="your-domain-id"

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Optional: Generate and run migrations
npx drizzle-kit generate:pg
npx drizzle-kit migrate
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Troubleshooting Installation

**Database Connection Issues:**
```bash
# Test database connection
npm run db:check

# Reset database schema
npm run db:reset
```

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>
```

**Module Resolution Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
socialai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configs
├── server/                # Express backend API
│   ├── services/          # External service integrations
│   ├── db.ts             # Database configuration
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Data access layer
├── shared/               # Shared TypeScript schemas
├── tests/                # Test suites
└── docs/                 # Documentation files
```

## 🔧 Development Guidelines

### Code Style & Conventions

**TypeScript Standards:**
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use descriptive variable and function names
- Always define return types for functions

**React Best Practices:**
- Use functional components with hooks
- Implement proper error boundaries
- Follow the single responsibility principle
- Use TypeScript for prop validation

**CSS & Styling:**
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's scale
- Use CSS variables for theme customization

### Git Workflow

**Branch Naming Convention:**
```
[type]/[ticket-number]-[brief-description]

Examples:
feature/SOCIAL-123-add-instagram-integration
bugfix/SOCIAL-456-fix-calendar-timezone
hotfix/SOCIAL-789-security-patch
```

**Commit Message Format:**
```
type(scope): brief description

[optional body]

[optional footer]
```

**Pull Request Template:**
```markdown
## Changes Made
- [ ] Feature implementation
- [ ] Bug fixes
- [ ] Documentation updates

## Testing Steps
1. Step-by-step testing instructions
2. Expected outcomes
3. Edge cases covered

## Screenshots
[Include relevant screenshots]

## Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] No console errors
- [ ] Responsive design verified
```

### Code Review Criteria

**Required Checks:**
- ✅ TypeScript compilation without errors
- ✅ All tests passing
- ✅ No ESLint warnings
- ✅ Proper error handling
- ✅ Security best practices followed
- ✅ Performance considerations addressed

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- components/auth/login-form.test.tsx
```

### Test Structure
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and service testing
- **E2E Tests**: Complete user journey testing

### Writing Tests
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../login-form';

describe('LoginForm', () => {
  it('should render login form fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

## 🚢 Deployment

### Replit Deployment (Recommended)

1. **Prepare for Deployment:**
```bash
npm run build
```

2. **Deploy to Replit:**
   - Click the "Deploy" button in your Repl
   - Choose "Reserved VM Deployment"
   - Configure environment variables
   - Deploy your application

3. **Environment Variables:**
Set all production environment variables in Replit Secrets:
- `DATABASE_URL`
- `JWT_SECRET`
- `AYRSHARE_API_KEY`
- `NODE_ENV=production`

### Production Configuration

**Database:**
- Use production Neon PostgreSQL instance
- Enable connection pooling
- Set up automated backups

**Security:**
- Use strong JWT secrets (256-bit)
- Enable HTTPS in production
- Configure CORS properly
- Set up rate limiting

**Monitoring:**
- Monitor application logs
- Set up error tracking
- Configure performance monitoring

### Rollback Procedures

**Emergency Rollback:**
1. Access Replit deployment dashboard
2. Select previous stable deployment
3. Revert to last known good state
4. Verify application functionality

**Database Rollback:**
```bash
# Restore from backup
npm run db:restore [backup-file]

# Rollback migrations
npm run db:rollback [migration-name]
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Social Platform Endpoints
- `GET /api/social-profiles` - List connected platforms
- `POST /api/social-profiles` - Create social profile
- `DELETE /api/social-profiles/:id` - Remove platform

### Content Management
- `GET /api/posts` - Retrieve posts
- `POST /api/posts` - Create new post
- `DELETE /api/posts/:id` - Delete post

### Analytics
- `GET /api/analytics` - Platform analytics
- `GET /api/messages` - Social messages
- `GET /api/comments` - Post comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add your feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@socialai.com
- 💬 Discord: [SocialAI Community](https://discord.gg/socialai)
- 📖 Documentation: [docs.socialai.com](https://docs.socialai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/socialai/issues)

## 🏗 Architecture

For detailed architecture information, see [Architecture Documentation](architecture.md).

---

**Made with ❤️ by the SocialAI Team**
