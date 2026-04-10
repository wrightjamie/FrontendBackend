# Color Spec

## Philosophy
The color system relies on a consistent palette using HEX for solid colors and RGBA for translucent overlays and shadows. We employ a semantic naming convention for usage to ensure consistency.

## Tokens Reference
See `specs/tokens/token-reference.md` for explicit hex mapping.
- **Brand/Primary**: Blue palette. Used for primary actions, active states.
- **Neutral**: Grayscale palette. Used for text, backgrounds, and borders.
- **Semantic**: Green (Success), Yellow (Warning), Red (Error), Cyan (Info).

## Usage Rules
- Never use raw hex or rgba values in component CSS.
- Always use the semantic Layer 2 aliases (e.g. `--color-primary`, `--color-text-secondary`).
- Maintain enough contrast ratio for accessibility. Avoid light gray text on light backgrounds.
