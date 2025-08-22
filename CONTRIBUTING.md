
# Contributing to SocialAI

We love your input! We want to make contributing to SocialAI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Branch Strategy
We use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) with the following branches:

- `main` - Production ready code
- `develop` - Integration branch for features
- `feature/*` - New features and enhancements
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency fixes for production

### Branch Naming Convention
```
feature/SOCIAL-123-add-instagram-integration
bugfix/SOCIAL-456-fix-calendar-timezone
hotfix/SOCIAL-789-security-patch
```

## Pull Request Process

1. **Fork the repo** and create your branch from `develop`
2. **Add tests** if you've added code that should be tested
3. **Update documentation** if you've changed APIs or functionality
4. **Ensure the test suite passes** by running `npm test`
5. **Make sure your code lints** by running `npm run lint`
6. **Create a pull request** using our PR template

### Pull Request Requirements

- [ ] All tests pass
- [ ] Code coverage doesn't decrease
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Reviewers assigned
- [ ] Related issues linked

## Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Prefer `interface` over `type` for object shapes
- Always define return types for functions
- Use descriptive variable and function names

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // Implementation
}

// ❌ Bad
type User = {
  id: any;
  email: any;
  createdAt: any;
}

function getUser(id) {
  // Implementation
}
```

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow single responsibility principle
- Use TypeScript for prop validation

```typescript
// ✅ Good
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  // Component implementation
}

// ❌ Bad
export function LoginForm(props: any) {
  // Component implementation
}
```

### CSS and Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theme customization
- Maintain consistent spacing using Tailwind's scale

```css
/* ✅ Good */
.button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors;
}

/* ❌ Bad */
.button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
}
```

## Testing Guidelines

### Writing Tests
- Write tests for all new features
- Maintain existing test coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

```typescript
// ✅ Good
describe('LoginForm', () => {
  it('should display validation error when email is invalid', async () => {
    // Arrange
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    // Act
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

### Test Categories
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and service interactions
- **E2E Tests**: Test complete user workflows

## Issue Guidelines

### Bug Reports
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment information
- Error logs

### Feature Requests
When requesting features, please include:
- Clear description of the feature
- Problem it solves
- Proposed solution
- User stories
- Acceptance criteria

## Security Guidelines

### Reporting Security Vulnerabilities
Please do **NOT** create a GitHub issue for security vulnerabilities. Instead:
1. Email security@socialai.com
2. Include detailed description
3. Provide steps to reproduce
4. Allow time for investigation

### Security Best Practices
- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication checks
- Follow OWASP security guidelines

## Development Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 9.0.0
- PostgreSQL >= 16.0
- Git >= 2.34.0

### Local Development
```bash
# Clone repository
git clone https://github.com/your-org/socialai.git
cd socialai

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env with your settings

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- login-form.test.tsx
```

## Code Review Process

### For Contributors
1. Create feature branch from `develop`
2. Make changes with tests and documentation
3. Create pull request with detailed description
4. Address review feedback promptly
5. Squash commits before merge

### For Reviewers
1. Review code for correctness and style
2. Check test coverage and quality
3. Verify documentation updates
4. Test functionality locally if needed
5. Provide constructive feedback

### Review Criteria
- [ ] Code follows style guidelines
- [ ] Tests are comprehensive and pass
- [ ] No performance regressions
- [ ] Security considerations addressed
- [ ] Documentation is updated
- [ ] Breaking changes are documented

## Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Steps
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to staging
5. Run tests and validation
6. Deploy to production
7. Create GitHub release

## Community

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Discord**: Real-time chat (invite link in README)
- **Email**: security@socialai.com for security issues

### Code of Conduct
We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- Annual contributor spotlight

## Getting Help

If you need help:
1. Check existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Join our Discord community

Thank you for contributing to SocialAI! 🚀
