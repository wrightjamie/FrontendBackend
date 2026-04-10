# Elevation Spec

## Philosophy
Elevation provides z-axis depth and hierarchy. It is implemented through both box-shadows and z-index layers.

## Tokens Reference

### Box Shadows
- `--shadow-sm`: Very subtle drop shadow for inline interactive elements.
- `--shadow-md`: Default shadow for elevated elements like dropdowns, standard cards.
- `--shadow-lg`: Prominent shadow for important elements, e.g., Modals, Popovers.
- `--shadow-xl`: Deep shadow for elements highest in the visual hierarchy like Toasts.

### Z-Index Layers
- `--z-base`: 0 (Default text, layout)
- `--z-dropdown`: 10 (Select dropdowns)
- `--z-sticky`: 20 (Sticky headers/footers)
- `--z-modal`: 30 (Modal dialogs)
- `--z-popover`: 40 (Popovers, tooltips)
- `--z-toast`: 9999 (Global toast notifications overlay)

## Usage Rules
- Never hardcode box-shadow strings. Use the generated shadow tokens.
- Never hardcode arbitrary z-index numbers (e.g., `999` or `1000`). Only use the registered semantic indices.
