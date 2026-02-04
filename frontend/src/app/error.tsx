'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Try again
            </button>
        </div>
    );
}

