# Contributing to FarCarFix

Thank you for your interest in contributing to FarCarFix!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/FarCarFix.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development Guidelines

- Follow the existing component patterns (functional components, TypeScript interfaces)
- Use the existing CSS classes from `index.css` and `features.css` before writing new styles
- Keep inline styles for dynamic/one-off values only
- All new components go in `src/components/`
- Use `motion/react` for animations, `lucide-react` for icons

## Adding New Diagnosis Issues

Open `src/components/DiagnosisResult.tsx` and add a new `if` block in the `analyze()` function following the existing pattern:

```ts
if (s.includes('your_keyword')) {
  return {
    issue: 'Issue Name',
    confidence: 85,
    actions: ['Step 1', 'Step 2'],
    warning: 'Safety warning if applicable.',
  };
}
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and commit with conventional commit messages
3. Push and open a PR against `main`
4. Ensure `npm run build` passes before submitting

## Commit Message Format

```
feat(scope): short description
fix(scope): what was fixed
style(scope): CSS or formatting changes
docs(scope): documentation updates
chore(scope): build, config, tooling
```
