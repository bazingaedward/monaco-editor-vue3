# GEMINI.md - Project Context

## Project Overview
**Monaco Editor Vue3** is a lightweight, feature-rich Vue 3 component library that wraps the [Monaco Editor](https://github.com/Microsoft/monaco-editor) (the editor behind VS Code). It provides high-level components and hooks for seamless integration into Vue 3 applications with full TypeScript support.

### Key Features
- **Components**: `<CodeEditor>` and `<DiffEditor>`.
- **Hooks API**: `useCodeEditor`, `useDiffEditor`, `useEditorState`, and `useEditorLifecycle` for custom editor logic.
- **Advanced UI**: Built-in loading states, error boundaries, and support for custom slots.
- **Multi-language Documentation**: Available in English, Simplified Chinese, and Traditional Chinese.

## Technology Stack
- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Editor Engine**: Monaco Editor
- **Build Tool**: Vite
- **Language**: TypeScript
- **Documentation**: VitePress
- **Testing**: Vitest + JSDOM
- **Linting & Formatting**: Biome + ESLint

## Directory Structure
- `src/`: Core logic and components.
  - `CodeEditor.vue`: Primary editor component.
  - `DiffEditor.vue`: Comparison editor component.
  - `hook.ts`: Core hooks for editor lifecycle and state management.
  - `typing.ts`: TypeScript interfaces and types.
  - `utils.ts`: Helper functions.
  - `components/`: Internal UI components (Loading, Error Boundary).
- `docs/`: VitePress documentation source.
- `scripts/`: Shell scripts for building and deployment.
- `typings/`: External type definitions.

## Building and Running

### Development
```bash
pnpm dev          # Start Vite dev server
pnpm docs:dev     # Start documentation dev server
```

### Build
```bash
pnpm build        # Build the library (dist/)
pnpm docs:build   # Build the documentation
```

### Testing & Quality
```bash
pnpm test         # Run Vitest
pnpm lint         # Run Biome and ESLint checks
pnpm lint:fix     # Automatically fix linting/formatting issues
```

### Commits
This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use `pnpm commit` to trigger the interactive commit tool.

## Development Conventions
- **Component Design**: Components are designed to be thin wrappers around hooks found in `src/hook.ts`.
- **State Management**: Use `useEditorState` to manage loading and error states consistently.
- **Event Naming**: Follows both standard Monaco events (e.g., `editorDidMount`) and Vue-style events (e.g., `update:value`).
- **Styling**: Uses Scoped CSS or Inline styles where appropriate. Avoid external CSS dependencies where possible.
- **Typing**: All props and events must be strictly typed in `src/typing.ts`.

## TODO / Future Plans
- Implementation of `MultiTabEditor.vue` for managing multiple files/models (see `todo.md` and `docs/examples/multi-tab.md`).
- `EmbeddedEditor.vue` for small code snippets.
- `ReadOnlyEditor.vue` for code viewing.
