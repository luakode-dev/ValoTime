import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    fullWidth?: boolean
}

export default function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseClasses = 'btn-base disabled:opacity-50 disabled:cursor-not-allowed'
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
    }
    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
