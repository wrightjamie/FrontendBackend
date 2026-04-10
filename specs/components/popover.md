# Popover Spec

## 1. Metadata
- **Name**: Popover
- **Category**: UI Component
- **Status**: Active

## 2. Overview
A standard Popover component used across the application to ensure visual consistency. Do not use raw values, only use tokens defined in the layer 2 architecture.

## 3. Anatomy
- Root wrapper
- Inner semantic elements
- Subelements

## 4. Tokens Used
- `--color-primary` (often mapped to `--popover-bg`)
- `--space-sm`, `--space-md`
- `--radius-rounded`
- `--transition-fast`

## 5. States
- **Default**: Base rendering.
- **Hover**: Subtle feedback using `--transition-fast`.
- **Active**: Immediate interaction feedback.
- **Disabled**: Lower opacity, `not-allowed` cursor.
- **Focus**: Visible outline focus ring.

## 6. Code Example
```css
/* Popover.module.css */
.root {
    background-color: var(--color-bg-primary);
    padding: var(--space-md);
    border-radius: var(--radius-rounded);
    transition: all var(--transition-fast);
}
```
