# Build Project

Run TypeScript type checking and production build.

## Usage

`/build` - Run full build with type checking

## Instructions

1. **Run the build**:

```bash
npm run build
```

This command runs:

- `vue-tsc -b` - TypeScript type checking
- `vite build` - Production bundle

2. **Report results**:
   - If successful: Confirm build passed, show bundle size
   - If errors: List each error with file, line, and message

## Common Build Errors

### TypeScript Errors

- **Missing types**: Add explicit types to parameters
- **Property doesn't exist**: Check spelling or add to interface
- **Type mismatch**: Verify expected vs actual types

### Import Errors

- **Module not found**: Check path alias `@/` resolves to `src/`
- **Missing export**: Verify the export exists in the source file

## Example Output

### Success

```
Build completed successfully!

dist/
  index.html      1.2 KB
  assets/
    index-abc123.js    45 KB
    index-def456.css   12 KB
```

### Failure

```
Build failed with 2 errors:

src/components/ProfileHero.vue:23:5
  error TS2322: Type 'string' is not assignable to type 'number'

src/stores/profile.ts:45:10
  error TS2304: Cannot find name 'UserType'
```
