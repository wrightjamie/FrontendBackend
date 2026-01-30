import styles from './Buttons.module.css';

export function Button({
    as: Component = 'button',
    variant = 'solid', // 'solid' | 'outline' | 'ghost'
    intent = 'primary', // 'primary' | 'secondary' | 'danger' etc.
    size = 'md',      // 'sm' | 'md' | 'lg'
    className: customClassName,
    children,
    ...props
}) {
    const className = [
        styles.btn,
        styles[size],
        styles[intent],
        variant !== 'solid' && styles[variant],
        customClassName
    ].filter(Boolean).join(' ');

    return (
        <Component className={className} {...props}>
            {children}
        </Component>
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