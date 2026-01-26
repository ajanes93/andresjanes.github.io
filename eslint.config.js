import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import pluginImport from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.vue", "**/*.ts", "**/*.tsx"],
    ignores: ["**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      "better-tailwindcss": betterTailwindcss,
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/index.css",
      },
    },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": [
        "warn",
        {
          rootFontSize: 16,
        },
      ],
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-unknown-classes": [
        "warn",
        {
          detectComponentClasses: true,
          ignore: ["^blur-fade", "^border-beam", "^animate-border-beam"],
        },
      ],
    },
  },
  {
    plugins: {
      import: pluginImport,
      perfectionist,
    },
    settings: {
      "import/resolver": {
        node: true,
        typescript: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "arrow-parens": "off",
      "class-methods-use-this": "off",
      eqeqeq: ["error", "always", { null: "always" }],
      "generator-star-spacing": "off",
      "id-length": [
        "error",
        {
          exceptions: ["_", "a", "b", "h", "i", "l", "r", "s", "x", "y"],
          min: 2,
          properties: "never",
        },
      ],
      "no-debugger": "error",
      "no-implicit-coercion": [
        "error",
        {
          boolean: true,
          disallowTemplateShorthand: true,
          number: true,
          string: true,
        },
      ],
      "no-param-reassign": [
        "error",
        {
          ignorePropertyModificationsFor: [
            "acc",
            "ctx",
            "e",
            "req",
            "request",
            "res",
            "response",
            "state",
          ],
          props: true,
        },
      ],
      "no-use-before-define": "off",
      "one-var": "off",
      "require-await": "error",
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "internal",
              pattern: "@/**",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "perfectionist/sort-array-includes": "off",
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-interfaces": [
        "error",
        { order: "asc", partitionByComment: true, type: "natural" },
      ],
      "perfectionist/sort-maps": "off",
      "perfectionist/sort-modules": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-object-types": [
        "error",
        { order: "asc", partitionByComment: true, type: "natural" },
      ],
      "perfectionist/sort-objects": "off",
      "perfectionist/sort-sets": "off",
      "perfectionist/sort-switch-case": "off",
      "perfectionist/sort-union-types": "off",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", next: "block", prev: "*" },
        { blankLine: "always", next: "*", prev: "block" },
        { blankLine: "always", next: "block-like", prev: "*" },
        { blankLine: "always", next: "*", prev: "block-like" },
        { blankLine: "never", next: "case", prev: "case" },
        { blankLine: "always", next: "return", prev: "*" },
        { blankLine: "always", next: "*", prev: "multiline-const" },
        { blankLine: "always", next: "*", prev: "multiline-let" },
        { blankLine: "always", next: "*", prev: "multiline-var" },
        { blankLine: "always", next: "*", prev: "multiline-expression" },
        { blankLine: "always", next: "multiline-const", prev: "*" },
        { blankLine: "always", next: "multiline-let", prev: "*" },
        { blankLine: "always", next: "multiline-var", prev: "*" },
        { blankLine: "always", next: "multiline-expression", prev: "*" },
      ],
      semi: ["error", "always"],
      "vue/attributes-order": ["error", { alphabetical: true }],
      "vue/block-order": ["error", { order: ["template", "script", "style"] }],
      "vue/component-name-in-template-casing": [
        "error",
        "PascalCase",
        {
          ignores: ["i18n", "i18n-d", "i18n-n", "i18n-t"],
          registeredComponentsOnly: false,
        },
      ],
      "vue/eqeqeq": "error",
      "vue/first-attribute-linebreak": "error",
      "vue/html-self-closing": [
        "error",
        {
          html: { component: "always", normal: "always", void: "always" },
          svg: "always",
        },
      ],
      "vue/max-len": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-boolean-default": "error",
      "vue/no-empty-component-block": "error",
      "vue/no-mutating-props": "off",
      "vue/no-template-target-blank": "error",
      "vue/no-unused-properties": [
        "error",
        {
          deepData: true,
          groups: ["data", "computed", "methods", "setup"],
          ignorePublicMembers: true,
        },
      ],
      "vue/no-unused-refs": "error",
      "vue/padding-line-between-blocks": ["error", "always"],
      "vue/prefer-prop-type-boolean-first": "error",
      "vue/prefer-true-attribute-shorthand": "error",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "*.d.ts"],
  }
);
