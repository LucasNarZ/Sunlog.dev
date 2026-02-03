'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@lib/apiClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import GoogleButton from '@/components/googleButton';
import { FormInput } from '@/components/FormInput';
import { PasswordInput } from '@/components/PasswordInput';
import { LoadingButton } from '@/components/LoadingButton';
import { ErrorAlert } from '@/components/ErrorAlert';
import { SignInSidebar } from '@/components/SignInSidebar';
import { Divider } from '@/components/Divider';
import { signInSchema, type SignInFormData } from '@/schemas/signInSchema';

const SignIn = () => {
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignInFormData) => {
        setApiError('');
        setIsSubmitting(true);

        try {
            const response = await apiClient.post('/auth/login', data);
            if (response.status === 200) {
                router.push('/profile');
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const status = err.response?.status;
                const message = err.response?.data?.message || err.message;

                if (status === 401) {
                    setApiError('Invalid email or password. Please try again.');
                } else if (status === 429) {
                    setApiError('Too many login attempts. Please try again later.');
                } else if (status === 403) {
                    setApiError('Your account has been locked. Please contact support.');
                } else {
                    setApiError(message || 'Login failed. Please try again.');
                }
            } else {
                setApiError('An unexpected error occurred. Please try again.');
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
                            Welcome Back
                        </h1>
                        <p className="text-neutral-600">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <FormInput
                            label="Email Address"
                            type="email"
                            inputId="signin-email"
                            placeholder="you@example.com"
                            error={errors.email}
                            autoComplete="email"
                            data-testid="email-input"
                            {...register('email')}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="signin-password"
                                    className="block text-sm font-medium text-neutral-700"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                inputId="signin-password"
                                placeholder="Enter your password"
                                error={errors.password}
                                autoComplete="current-password"
                                data-testid="password-input"
                                {...register('password')}
                            />
                        </div>

                        {apiError && <ErrorAlert message={apiError} onDismiss={() => setApiError('')} />}

                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Signing in..."
                            data-testid="submit-button"
                        >
                            Sign In
                        </LoadingButton>

                        <Divider />

                        <div className="grid grid-cols-1 gap-3">
                            <GoogleButton />
                        </div>

                        <p className="text-center text-sm text-neutral-600">
                            Don't have an account?{' '}
                            <Link
                                href="/sign-up"
                                className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                            >
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>

                <SignInSidebar />
            </div>
        </div>
    );
};

export default SignIn;
