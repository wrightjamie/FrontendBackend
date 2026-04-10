# Radius Spec

## Philosophy
Border radii convey interactivity. We maintain a very small selection of possible edge roundings.

## Tokens Reference
- `--radius-subtle`: 4px - Used for very subtle smoothing, e.g. input fields or small badges.
- `--radius-rounded`: 8px - The default rounding for larger components like Cards, Modals.
- `--radius-round`: 9999px - Used for pill-based designs like badges or status pills.
- `--radius-circle`: 50% - Used exclusively for components that require perfect circles (e.g. avatars).

## Usage Rules
- Never use raw `px` or `%` values for `border-radius`.
- Use `--radius-subtle` and `--radius-rounded` according to component prominence.
