# Run Tests

Run Vitest unit tests.

## Usage

`/test` - Run all tests
`/test ComponentName` - Run tests matching pattern

## Instructions

1. **Parse arguments**:
   - No argument: Run all tests
   - With argument: Run tests matching the pattern

2. **Run the tests**:

### All tests

```bash
npm run test
```

### Specific file or pattern

```bash
npm run test -- ComponentName
npm run test -- ProfileHero
npm run test -- composables
```

3. **Report results**:
   - Summarize pass/fail counts
   - Show any failures with file and test name
   - Suggest fixes for common issues

## Additional Options

### Run in watch mode

```bash
npm run test -- --watch
```

### Run with coverage

```bash
npm run test -- --coverage
```

### Run with UI

```bash
npm run test -- --ui
```

## Common Test Issues

1. **Import errors for globals**: Don't import `describe`, `it`, `expect`, `vi` - they're global in Vitest
2. **Component not mounting**: Check all required props are provided
3. **Async issues**: Use `await` with `.trigger()` and state changes
4. **Mock not working**: Ensure mocks are at module level with `vi.mock()`

## Example Output

### Success

```
 ✓ src/components/ProfileHero.spec.ts (3 tests)
 ✓ src/composables/useCvGenerator.spec.ts (2 tests)

Test Files  2 passed (2)
     Tests  5 passed (5)
```

### Failure

```
 ✗ src/components/ProfileHero.spec.ts
   ✗ displays the profile name
     → expected "John Doe" but got "Jane Doe"

Test Files  1 failed (1)
     Tests  1 failed, 2 passed (3)
```
