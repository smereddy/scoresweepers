# Contributing to ScoreSweep

Thank you for your interest in contributing to ScoreSweep! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism in all interactions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS
- Familiarity with Supabase (optional but helpful)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/scoresweep.git
   cd scoresweep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

### Key Directories

- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/data/` - Mock data and type definitions
- `src/lib/` - Utility functions and configurations
- `supabase/` - Database migrations and edge functions

### Component Organization

- Each component should be in its own file
- Use TypeScript interfaces for props
- Include JSDoc comments for complex components
- Follow the single responsibility principle

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo() for performance optimization when needed
- Follow React best practices for state management

### Styling

- Use Tailwind CSS classes
- Follow the design system defined in `tailwind.config.js`
- Use consistent spacing (8px system)
- Ensure responsive design for all components

### File Naming

- Use PascalCase for component files: `ComponentName.tsx`
- Use camelCase for utility files: `utilityFunction.ts`
- Use kebab-case for page routes: `audit-wizard`

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(auth): add Google OAuth integration
fix(upload): resolve file validation error
docs(readme): update installation instructions
style(dashboard): improve responsive layout
refactor(api): simplify error handling logic
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

2. **Update documentation** if needed

3. **Add tests** for new features

4. **Ensure responsive design** works on all screen sizes

### PR Requirements

- Clear, descriptive title
- Detailed description of changes
- Screenshots for UI changes
- Link to related issues
- Passing CI checks

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Verified responsive design

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## Testing

### Manual Testing

- Test all user flows
- Verify responsive design on different screen sizes
- Check accessibility with screen readers
- Test with different browsers

### Automated Testing

- Write unit tests for utility functions
- Add integration tests for complex workflows
- Ensure all tests pass before submitting PR

## Documentation

### Code Documentation

- Use JSDoc comments for functions and components
- Include examples in documentation
- Document complex algorithms or business logic

### README Updates

- Update README.md for new features
- Include setup instructions for new dependencies
- Add troubleshooting information

## Security Guidelines

### Data Handling

- Never log sensitive information
- Validate all user inputs
- Use proper authentication checks
- Follow OWASP security guidelines

### Environment Variables

- Never commit secrets to version control
- Use environment variables for configuration
- Document required environment variables

## Performance Guidelines

### Code Optimization

- Use React.memo() for expensive components
- Implement proper loading states
- Optimize images and assets
- Minimize bundle size

### Database Queries

- Use efficient Supabase queries
- Implement proper pagination
- Cache frequently accessed data

## Accessibility

### Requirements

- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Testing

- Test with keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Ensure focus management

## Getting Help

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Communication

- GitHub Issues for bug reports and feature requests
- GitHub Discussions for questions and ideas
- Email: hello@scoresweep.org for sensitive issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for major features

Thank you for contributing to ScoreSweep! 🚀