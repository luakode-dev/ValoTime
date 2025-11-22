import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`input-base resize-none ${error ? 'border-red-500' : ''} ${className}`}
                    rows={4}
                    {...props}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export default Textarea
