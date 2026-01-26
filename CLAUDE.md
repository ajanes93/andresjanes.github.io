# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal portfolio website for Andres Janes. A modern, single-page Vue 3 application with AI integration features.

**Live site:** https://andresjanes.com

## Quick Reference Commands

| Task                     | Command                    |
| ------------------------ | -------------------------- |
| Start dev server         | `npm run dev`              |
| Build for production     | `npm run build`            |
| Preview production build | `npm run preview`          |
| Lint & fix               | `npm run lint`             |
| Format code              | `npm run format`           |
| Run tests                | `npm run test`             |
| Type check               | `npm run typecheck`        |
| Generate AI summary      | `npm run generate:summary` |

## Technology Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript (strict mode)
- **Build**: Vite
- **Styling**: Tailwind CSS 4
- **State**: Pinia
- **UI Components**: ShadCN Vue (Radix Vue primitives)
- **Icons**: Lucide Vue
- **Animations**: motion-v, vue-use-spring
- **PDF Generation**: jsPDF
- **Git Hooks**: Lefthook (pre-commit: lint, format, typecheck)

## Directory Structure

```
src/
  components/       # Vue components
    ui/             # Reusable UI components (Button, Card, Badge, etc.)
    icons/          # Custom SVG icon components
  stores/           # Pinia stores
    profile.ts      # Main profile data store
  composables/      # Vue composables
  data/             # Static JSON data
  lib/              # Utility functions
  App.vue           # Root component
  main.ts           # App entry point
  index.css         # Global styles & Tailwind theme
public/
  img/              # Images (profile, company logos)
```

## Key Conventions

### Component Style

- Use `<script setup lang="ts">` syntax
- Type props with `defineProps<Props>()`
- Use Composition API exclusively
- **Always add explicit types**: refs, computed, and functions must have type annotations
- **No instance variables**: Never use `$props`, `$emit`, `$attrs`, `$slots` in templates. Always define these in the setup block and reference the local variables instead.

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  title: string;
  count?: number;
}

interface Emits {
  (e: "update", value: string): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<Emits>();

// Refs use generic type parameter
const isLoading = ref<boolean>(false);
const items = ref<string[]>([]);

// Computed use generic type parameter
const display = computed<string>(() => `${props.title} (${props.count})`);

// Functions must have return types
function handleClick(): void {
  isLoading.value = true;
  emit("update", "clicked");
}
</script>

<!-- In template, use props.X and emit(), NOT $props or $emit -->
<template>
  <div>{{ props.title }}</div>
  <button @click="emit('close')">Close</button>
</template>
```

### Styling

- Tailwind CSS utility classes for styling
- Use `cn()` utility from `@/lib/utils` for conditional classes
- CVA (class-variance-authority) for component variants
- Dark mode supported via `.dark` class

### State Management

- Profile data centralized in `stores/profile.ts`
- Use composables for reusable logic

### Path Alias

- `@/` maps to `src/` directory

## Testing Conventions

### Writing Tests

- **Test files**: Place `.test.ts` files next to source files
- **Use data-testid**: ALL elements should have `data-testid` attributes for testing
- **Use helpers**: Use `wrapper.findByTestId()` and `wrapper.findAllByTestId()` (never `wrapper.find('[data-testid="..."]')`)
- **Type render function**: Use `RenderOptions<typeof Component>` from `@/test/utils`
- **No globals imported**: `describe`, `it`, `expect`, `beforeEach`, `vi` are auto-imported

### Test File Pattern

```typescript
import { mount } from "@vue/test-utils";
import type { RenderOptions } from "@/test/utils";
import MyComponent from "./MyComponent.vue";

const TEST_PROPS = {
  /* ... */
};

const render = (options: RenderOptions<typeof MyComponent> = {}) => {
  const wrapper = mount(MyComponent, {
    props: { ...TEST_PROPS, ...options.props },
    global: { ...options.global },
  });

  return {
    wrapper,
    getElement: () => wrapper.findByTestId("element-id"),
  };
};

describe("MyComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getElement } = render();
    expect(getElement().exists()).toBe(true);
  });
});
```

### Adding data-testid to Components

```vue
<!-- Attribute order: dynamic, data-testid, static -->
<button :disabled="isLoading" data-testid="submit-button" type="submit">
  Submit
</button>
```

## Code Formatting

- **ESLint**: Handles linting and code quality (`npm run lint`)
- **Prettier**: Handles code formatting (`npm run format`)
- **Lefthook**: Pre-commit hooks run lint, format, and typecheck automatically
- Attribute ordering in Vue templates is enforced (alphabetical for static attributes)

## Before Committing

Pre-commit hooks (via Lefthook) automatically run:

1. ESLint with auto-fix on staged files
2. Prettier formatting on staged files
3. TypeScript type checking

Manual checks if needed:

- `npm run lint` - Lint and fix
- `npm run format` - Format code
- `npm run typecheck` - Type check
- `npm run test` - Run tests
- `npm run build` - Full production build

## Agents & Commands

### Agents (in `.claude/agents/`)

- **test-writer**: Writes Vitest unit tests for components and composables
- **code-reviewer**: Reviews code for quality, security, and best practices
- **code-simplifier**: Refactors code for clarity and maintainability

### Commands (in `.claude/commands/`)

- `/pr` - Create or update GitHub pull request
- `/build` - Run TypeScript checking and production build
- `/test` - Run Vitest unit tests

### Recommended Workflow

1. Implement feature
2. Run `/build` to check types
3. Use **test-writer** to add tests
4. Run `/test` to verify
5. Use **code-reviewer** to review changes
6. Use **code-simplifier** if code needs cleanup
7. Run `/pr` to create pull request

## Coding Philosophy

> Clear is better than clever.
> Every line of code is a liability.
> Make it work. Make it clear. Make it fast. (in that order)

- Keep it simple - this is a single-page portfolio
- Prefer explicit code over clever abstractions
- Reuse existing UI components from `src/components/ui/`
