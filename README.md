# Andres Janes - Personal Portfolio

A modern single-page portfolio website built with Vue 3, TypeScript, and Tailwind CSS 4.

**Live site:** [andresjanes.com](https://andresjanes.com)

## Features

- **LLM Integration Hub**: Animated visual hub with one-click prompts for ChatGPT, Claude, Gemini, and Perplexity to analyze the candidate profile
- **AI-Generated Summary**: Pre-generated professional summary powered by Claude
- **PDF CV Download**: Generate and download a professionally formatted CV
- **Experience Timeline**: Interactive timeline with tracing beam animation and company logos
- **Skills Display**: Categorized technical skills with color-coded badges
- **Recommendations**: LinkedIn testimonials in a card grid layout
- **Dark Mode**: System-aware theme with manual toggle and localStorage persistence
- **Scroll Animations**: BlurFade entrance animations on scroll using IntersectionObserver
- **Responsive Design**: Optimized for all screen sizes

## Tech Stack

### Core

- **Vue 3.5** - Composition API with `<script setup>`
- **TypeScript 5.7** - Strict mode
- **Vite 6** - Build tool
- **Pinia 3** - State management

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS with `@theme` configuration
- **ShadCN Vue** - UI components built on Radix Vue primitives
- **Lucide Vue** - Icon library
- **class-variance-authority** - Component variant system

### Animations

- **motion-v** - Motion primitives for Vue
- **vue-use-spring** - Spring physics animations
- **VueUse** - Composition API utilities

### PDF & Utilities

- **jsPDF** - PDF generation for CV download

### Development

- **Vitest** - Unit testing with Vue Test Utils
- **ESLint 9** - Linting with Vue and TypeScript plugins
- **Prettier** - Code formatting with Tailwind plugin
- **Lefthook** - Git hooks (pre-commit: lint, format, typecheck)

## Project Setup

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Other Commands

```bash
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run lint         # Lint and fix
npm run format       # Format code
npm run typecheck    # TypeScript check
```

## Deployment

Deployed to GitHub Pages via GitHub Actions. Push to `main` to trigger deployment.

## Author

Andres Janes - [LinkedIn](https://www.linkedin.com/in/andresjanes/) | [GitHub](https://github.com/ajanes93)
