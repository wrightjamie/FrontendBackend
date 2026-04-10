# Motion Spec

## Philosophy
Motion is utilized solely to enhance interactions without feeling sluggish.

## Tokens Reference
- `--transition-fast`: `150ms ease` - Best for subtle micro-interactions like colors, borders, and hovers.
- `--transition-base`: `200ms ease` - Best for layout shifts, standard modal entrances, or expanding elements.
- `--transition-slow`: `300ms ease` - Very noticeable motion, used for page transitions or complex choreography.

## Usage Rules
- The transition tokens already package the duration and the easing function. Specify properties explicitly when consuming them: `transition: background-color var(--transition-fast), transform var(--transition-base);`
- Never specify hardcoded durations like `0.2s` directly in CSS.
