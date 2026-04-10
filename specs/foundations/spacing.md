# Spacing Spec

## Philosophy
Spacing is defined using an absolute scale rather than semantic sizes to prevent ambiguity. We use root em (rem) to ensure scaling with user preferences.

## Tokens Reference
Available spacing tokens range from `--space-1` (2px) to `--space-10` (64px) via their aliases:
- `--space-xs`: 0.25rem (4px)
- `--space-sm`: 0.5rem (8px)
- `--space-md`: 1rem (16px)
- `--space-lg`: 1.5rem (24px)
- `--space-xl`: 2rem (32px)
- `--space-xxl`: 3rem (48px)

## Usage Rules
- **Margins & Paddings**: Exclusively use spatial aliases (e.g., `--space-md`). Combine values using standard CSS syntax (`padding: var(--space-sm) var(--space-md)`).
- **Gap**: Flex and Grid gaps should always use spatial aliases.
- Never hardcode `px`, `em`, or `rem` values directly into component CSS.
