import styles from './Button.module.css';

export function Button({
    variant = 'solid', // 'solid' | 'outline' | 'ghost'
    intent = 'primary', // 'primary' | 'secondary' | 'danger' etc.
    size = 'md',      // 'sm' | 'md' | 'lg'
    children,
    ...props
}) {
    const className = clsx(
        styles.btn,               // Always apply base styles
        styles[size],             // Apply 'sm' or 'lg' if they match
        styles[intent],           // Apply 'secondary', 'danger', etc.
        variant !== 'solid' && styles[variant] // Apply 'outline' or 'ghost'
    );

    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}

// Example Usage

//A big, red, outlined button
// <Button size="lg" intent="danger" variant="outline">
//   Delete Account
// </Button>

// A small success button
// <Button size="sm" intent="success">
//   Save Changes
// </Button>

// Standard ghost button
// <Button variant="ghost">
//   Cancel
// </Button>