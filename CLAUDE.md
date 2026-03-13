# Rules for Claude

## Build & Verify

- After every change, the app must compile and run successfully.
- Run `npx tsc --noEmit` to verify TypeScript after changes.
- Never leave the codebase in a broken state.
- If tests exist, all tests must pass before considering any work done.
- Both frontend AND backend must be in a working state after every change. If a frontend change affects the backend (or vice versa), verify both.

## Dependency Guide (REQUIRED)

Every external dependency API used in source code must be documented in `DEPENDENCY_GUIDE.md` at the project root.

### Source files — one-liner reference
Before `import` statements, add:
```ts
// Dependencies: hookName, ComponentName, utilFunction — see DEPENDENCY_GUIDE.md
```
Skip the one-liner if the file only uses our own code (e.g. pure components with no external deps beyond React basics).

### DEPENDENCY_GUIDE.md — entry format
For each new external API used, add an entry:
```
### `name`
**From:** `package-name`
**Used in:** `FileName.tsx`

Prose explanation of what it does and why we use it.
```

### What goes in the guide vs source files
- **DEPENDENCY_GUIDE.md**: Explanations of what dependency-provided APIs do (hooks, components, utilities from axios, react-router, recharts, etc.)
- **Source files**: Light business logic comments stay in the source — only dependency explanations go in the guide

### When to update
- When creating a new file that uses external APIs → add the one-liner + guide entries
- When adding a new external API to an existing file → update the one-liner + add guide entry
- When removing usage of an external API → clean up the one-liner + remove guide entry if no longer used anywhere
