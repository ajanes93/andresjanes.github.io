# Personal CV Project

I decided as a way to update my CV and as an opportunity to learn some new tech, that I would do this project.
It has given me the opportunity to dive into some new frontend tech and also learn and explore some existing tech
that I have always wanted to try! This project is definitely over-engineered for such a simple app, but it allows
perspective employers to get an idea of what my code looks like and the experience I have.

## Built with:

-   Vue 3
-   Vuex 4
-   Vite
-   Vitest
-   Typescript
-   Tailwind CSS
-   Material Design Icons
-   Eslint & Prettier

## CI tooling

-   Gitlab CI

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Preview the built files (should be run after the build command)

```
npm run preview
```

## Linting and formatting

### Lints and fixes files

```
npm run lint
```

### Formats code using Prettier

```
npm run format
```

## Testing

### Run tests in watch mode

```
npm run test:watch
```

### Run tests and generate junit and coverage reports

```
npm run test
```

## Docker

To run the project using docker please see the [Docker README](https://gitlab.com/andresjanes/andresjanes.gitlab.io/-/tree/master/docker/README.md)

## Recommended IDE Setup

-   [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
