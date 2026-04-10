# Typography Spec

## Philosophy
Typography relies on standard scales configured directly in the token file as rem values in order to provide an accessible core. Font weights and leading (line-height) are similarly constrained.

## Tokens Reference

### Font Sizes
- `--text-xs`: 0.75rem (12px)
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.125rem (18px)
- `--text-xl`: 1.25rem (20px)
- `--text-2xl`: 1.5rem (24px)
- `--text-3xl`: 2rem (32px)
- `--text-4xl`: 2.5rem (40px)

### Font Weights
- `--font-normal`: 400
- `--font-medium`: 500
- `--font-semibold`: 600
- `--font-bold`: 700

### Line Heights
- `--leading-tight`: 1.25
- `--leading-normal`: 1.5
- `--leading-relaxed`: 1.75

## Usage Rules
- Never use direct numbers for `font-weight`, `font-size`, or `line-height`.
- Always employ defined layer 2 aliases.
