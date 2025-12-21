# Contributing to FleetTrack

Thank you for your interest in contributing to FleetTrack!

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: Add fuel efficiency dashboard
fix: Resolve login authentication issue
docs: Update installation instructions
```

## Code Style

### TypeScript/Angular
- Use TypeScript strict mode
- Follow Angular style guide
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### JavaScript/Node.js
- Use ES6+ features
- Follow Airbnb JavaScript style guide
- Use async/await over callbacks
- Handle errors properly

## Testing

Before submitting a PR:

1. **Run linting**
   ```bash
   npm run lint
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Test manually**
   - Test in both web and mobile interfaces
   - Verify offline functionality
   - Check different user roles

## Project Structure

```
Angular/
├── backend/              # API server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── utils/           # Utility functions
├── gestion-des-deplacements/  # Web app
│   └── src/app/
│       ├── features/    # Feature modules
│       ├── core/        # Core services
│       └── shared/      # Shared components
└── e-logbook/           # Mobile PWA
    └── src/app/
        ├── features/    # Mobile features
        └── core/        # Services & sync
```

## Need Help?

- Check existing issues and documentation
- Contact the project maintainer
- Ask questions in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
