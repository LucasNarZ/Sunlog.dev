'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center px-4">
                <div className="relative">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        404
                    </h1>
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary to-secondary"></div>
                </div>

                <h2 className="mt-8 text-3xl font-semibold text-gray-800">
                    Page Not Found
                </h2>

                <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="mt-8 flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>

                <div className="mt-12 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                </div>
            </div>
        </div>
    );
}
