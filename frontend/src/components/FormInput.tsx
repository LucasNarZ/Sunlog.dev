import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { FieldErrorIcon } from '@/components/FieldErrorIcon';
import { FieldCorrectIcon } from '@/components/FieldCorrectIcon';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: FieldError;
    success?: boolean;
    rightIcon?: ReactNode;
    inputId?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, success, rightIcon, inputId, className = '', ...props }, ref) => {
        const id = inputId || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
        const hasError = !!error;

        return (
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-neutral-700 mb-2"
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${id}-error` : success ? `${id}-success` : undefined}
                        className={`w-full border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 transition-all duration-200 focus-visible:ring-offset-2 ${rightIcon ? 'pr-12' : ''
                            } ${hasError
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-neutral-300 focus:ring-primary focus:border-transparent'
                            } ${className}`}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {hasError && (
                    <div
                        id={`${id}-error`}
                        role="alert"
                        className="flex items-start gap-2 mt-2 text-red-600 text-sm"
                    >
                        <FieldErrorIcon />
                        <span>{error.message}</span>
                    </div>
                )}

                {success && !hasError && (
                    <div
                        id={`${id}-success`}
                        className="flex items-center gap-2 mt-2 text-green-600 text-sm"
                    >
                        <FieldCorrectIcon />
                        <span>Valid input</span>
                    </div>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';
