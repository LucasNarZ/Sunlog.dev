'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@lib/apiClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import { FormInput } from '@/components/FormInput';
import { PasswordInput } from '@/components/PasswordInput';
import { LoadingButton } from '@/components/LoadingButton';
import { ErrorAlert } from '@/components/ErrorAlert';
import { SignUpSidebar } from '@/components/SignUpSidebar';
import { FieldCorrectIcon } from '@/components/FieldCorrectIcon';
import { signUpSchema, getPasswordStrength, type SignUpFormData } from '@/schemas/signUpSchema';

const SignUp = () => {
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, dirtyFields },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            repeatPassword: '',
        },
    });

    const password = watch('password');
    const repeatPassword = watch('repeatPassword');

    const passwordStrength = useMemo(() => getPasswordStrength(password || ''), [password]);
    const passwordsMatch = password && repeatPassword && password === repeatPassword;

    const onSubmit = async (data: SignUpFormData) => {
        setApiError('');
        setIsSubmitting(true);

        try {
            const { repeatPassword: _, ...submitData } = data;
            await apiClient.post('/auth/register', submitData);
            router.push('/sign-in');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const message = err.response?.data?.message || err.message;
                const status = err.response?.status;
                const field = err.response?.data?.field;

                if (status === 429) {
                    setApiError('Too many attempts. Please try again later.');
                } else if (status === 409) {
                    setApiError('An account with this email already exists.');
                } else if (field && ['name', 'email', 'password'].includes(field)) {
                    setError(field as keyof SignUpFormData, {
                        type: 'server',
                        message,
                    });
                } else {
                    setApiError(message);
                }
            } else {
                setApiError('Unexpected error. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-neutral-100 via-white to-neutral-100 p-4">
            <div className="flex bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-neutral-600">Join our community of developers</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <FormInput
                            label="Full Name"
                            type="text"
                            inputId="signup-name"
                            placeholder="Enter your name"
                            error={errors.name}
                            success={dirtyFields.name && !errors.name}
                            autoComplete="name"
                            data-testid="name-input"
                            {...register('name')}
                        />

                        <FormInput
                            label="Email Address"
                            type="email"
                            inputId="signup-email"
                            placeholder="you@example.com"
                            error={errors.email}
                            success={dirtyFields.email && !errors.email}
                            autoComplete="email"
                            data-testid="email-input"
                            {...register('email')}
                        />

                        <PasswordInput
                            label="Password"
                            inputId="signup-password"
                            placeholder="Create a strong password"
                            error={errors.password}
                            showStrength
                            strength={passwordStrength}
                            autoComplete="new-password"
                            data-testid="password-input"
                            {...register('password')}
                        />

                        <div>
                            <PasswordInput
                                label="Confirm Password"
                                inputId="signup-repeat-password"
                                placeholder="Confirm your password"
                                error={errors.repeatPassword}
                                autoComplete="new-password"
                                data-testid="repeat-password-input"
                                {...register('repeatPassword')}
                            />
                            {passwordsMatch && !errors.repeatPassword && (
                                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                                    <FieldCorrectIcon />
                                    <span>Passwords match</span>
                                </div>
                            )}
                        </div>

                        {apiError && <ErrorAlert message={apiError} onDismiss={() => setApiError('')} />}

                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Creating Account..."
                            data-testid="submit-button"
                        >
                            Create Account
                        </LoadingButton>

                        <p className="text-center text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>

                <SignUpSidebar />
            </div>
        </div>
    );
};

export default SignUp;
