# Project Norms and Conventions

v1.0 — 2026-01-14

This file defines the standards, conventions, and patterns that all code and collaborators—including the AI agent—should follow.  

All updates to these norms must be reviewed and approved by humans. AI may propose updates in `TODO.md` under **💡 Suggestions (Norm Updates)**.

---

## 1. Styling / CSS

- Use **CSS Modules** for all component-level styles
  - File naming: `ComponentName.module.css`
- Prefer **modern CSS** wherever possible
  - Use **CSS variables** for colors, spacing, themes
  - Prohibit inline styles and JavaScript-driven styling (`style={{...}}`)
- Use **`data-` attributes** for conditional styling (e.g., `[data-state="active"] { ... }`)
- Avoid CSS-in-JS, styled-components, or other inline styling solutions
- Keep styles scoped to components; avoid global overrides
- Follow a consistent naming convention:
  - `camelCase` for local class names
  - Avoid global CSS unless necessary
- Prefer CSS solutions over JavaScript wherever possible

---

## 2. Folder Structure

- `src/`
  - `components/` → all React components (UI building blocks)
  - `pages/` → page-level components
  - `api/` → API client modules
  - `utils/` → helper functions / pure utilities
  - `hooks/` → custom React hooks
  - `styles/` → shared style files (variables, themes)
  - `tests/` → shared testing utilities or global mocks
- One folder per concept; avoid deeply nested folders

---

## 3. Naming Conventions

- Components: **PascalCase**
- Functions, variables: **camelCase**
- Constants: **UPPER_CASE**
- Files: match component or module name (e.g., `MyComponent.jsx` / `myUtil.js`)
- Test files: `<filename>.test.js` or `<filename>.spec.js`

---

## 4. Testing

- Use **Jest + React Testing Library**
- Tests should describe observable behavior, not implementation details
- Test new features alongside development
- Bug fixes must include regression tests
- Keep tests deterministic and clear
- Organize test files near the module they test

---

## 5. Architecture & Patterns

- Components should be **presentational or container**; favor composition
- Avoid global state unless absolutely necessary
- Use a **centralized API client** for all network requests
- Avoid `fetch` directly in components
- Prefer simpler, readable solutions over clever abstractions
- Document all non-trivial design decisions in `AGENT.md` or a `DECISIONS.md`

---

## 6. AI & Collaboration Guidelines

- AI must **follow these norms** when generating code
- AI may propose updates as **norm suggestions** in `TODO.md` using `S-NORM-###` IDs
- Humans must review and approve any changes to these norms
- Tasks that violate norms should trigger an AI suggestion for correction
- Keep all norms **practical and enforceable**; avoid vague rules

---

## 7. Versioning / Updates

- Use the **date and version number** at the top for tracking changes
- Record minor updates in a changelog section
- Major updates must be approved through `TODO.md` norm suggestions

---

## 8. Optional / Emerging Patterns

- AI may notice patterns and suggest:
  - New hooks for repeated logic
  - Component patterns to simplify repetition
  - Folder restructuring for scalability
- **Only updates to `NORM.md` should use the `S-NORM-###` ID prefix**
    
---

## 9. Template Integrity

- **No project-specific logic**: This repository is a template. Do not add business logic or domain code here.
- **Universal Applicability**: Changes must be relevant to *all* future projects using this template.
- **Drift Prevention**: If a change feels specific to one use case, it belongs in a fork, not here.

---

## 10. Version Control (Git)

- **Branches**:
  - `main`: Production-ready code.
  - `feature/<task-id>-<short-desc>`: For new features (e.g., `feature/B-001-init-project`).
  - `fix/<task-id>-<short-desc>`: For bug fixes.
- **Commits**:
  - Use conventional commits: `type: description` (e.g., `feat: setup react app`, `fix: header alignment`).
  - Keep commits focused and atomic.
- **Workflow**:
  - Create a branch for the task.
  - Implement and verify changes.
  - Commit often.
  - Merge to `main` when the task is **Done**.
