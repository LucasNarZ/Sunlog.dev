'use client';

import { useState, FormEvent } from 'react';
import { apiClient } from '@lib/apiClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleButton from '@/components/googleButton';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);
            const body = { email, password };
            const response = await apiClient.post('/auth/login', body);
            if (response.status === 200) {
                router.push('/profile');
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
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
                        <p className="text-neutral-600">
                            Sign in to continue your journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full border border-neutral-300 rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errorMessage) setErrorMessage(null);
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    className="w-full border border-neutral-300 rounded-xl h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errorMessage) setErrorMessage(null);
                                    }}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-200 ${loading
                                ? 'bg-neutral-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-neutral-500">Or</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <GoogleButton />
                        </div>

                        <p className="text-center text-sm text-neutral-600">
                            Don't have an account?{' '}
                            <Link
                                href="/sign-up"
                                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white flex-col items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="mb-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">
                                Welcome Back!
                            </h2>
                            <p className="text-white/90 text-lg mb-8">
                                Continue building amazing projects
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
