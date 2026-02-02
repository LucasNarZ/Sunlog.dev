import { Advantage } from '@/components/Advantage';

export const SignUpSidebar = () => {
    return (
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white flex-col items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative z-10 text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Begin Your Journey</h2>
                </div>

                <div className="space-y-4 text-left max-w-sm mx-auto">
                    <Advantage
                        title="Track Progress"
                        description="Document your development journey with detailed devlogs"
                    />
                    <Advantage
                        title="Share Knowledge"
                        description="Connect with other developers and learn together"
                    />
                    <Advantage
                        title="Build Portfolio"
                        description="Showcase your projects and grow your reputation"
                    />
                </div>
            </div>
        </div>
    );
};
