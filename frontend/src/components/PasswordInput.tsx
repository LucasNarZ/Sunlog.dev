import { forwardRef, useState, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import { ShowPasswordIcon } from '@/components/ShowPasswordIcon';
import { NotShowPasswordIcon } from '@/components/NotShowPasswordIcon';
import { FieldErrorIcon } from '@/components/FieldErrorIcon';

interface PasswordStrength {
    strength: number;
    label: string;
    color: string;
}

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    error?: FieldError;
    showStrength?: boolean;
    strength?: PasswordStrength;
    inputId?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, showStrength = false, strength, inputId, value, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
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
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${id}-error` : showStrength ? `${id}-strength` : undefined}
                        className={`w-full border rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 focus-visible:ring-offset-2 ${hasError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-neutral-300 focus:ring-primary focus:border-transparent'
                            }`}
                        value={value}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <ShowPasswordIcon /> : <NotShowPasswordIcon />}
                    </button>
                </div>

                {showStrength && value && strength && strength.strength > 0 && (
                    <div id={`${id}-strength`} className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${strength.color}`}
                                    style={{ width: `${(strength.strength / 4) * 100}%` }}
                                />
                            </div>
                            <span
                                className={`text-xs font-medium ${strength.strength === 4 ? 'text-green-600' : 'text-neutral-500'
                                    }`}
                            >
                                {strength.label}
                            </span>
                        </div>
                    </div>
                )}

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
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';
