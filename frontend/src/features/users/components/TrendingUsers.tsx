import Image from 'next/image';
import Link from 'next/link';
import { getTrendingUsers } from '@/features/users/services/getTrendingUsers';

const TrendingUsers = async () => {
    const users = await getTrendingUsers();

    return (
        <div className="border border-neutral-200 rounded-3xl shadow-sm bg-white overflow-hidden">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white p-6 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">
                            Trending Developers
                        </h2>
                        <p className="text-sm text-neutral-600">
                            Most followed this week
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {users?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user, index) => (
                            <Link
                                key={user.id}
                                href={`/${user.slug}`}
                                className="group relative"
                            >
                                <div className="relative border border-neutral-200 rounded-2xl p-5 bg-white hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        #{index + 1}
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full ring-2 ring-neutral-200 group-hover:ring-purple-300 transition-all duration-300 overflow-hidden">
                                                <Image
                                                    src={user.profileImgUrl}
                                                    alt={user.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-neutral-900 group-hover:text-purple-600 transition-colors truncate">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-neutral-500 truncate">
                                                @{user.slug}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                    <span className="font-semibold text-neutral-700">
                                                        {user.followersNumber.toLocaleString()}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-400">•</span>
                                                <span className="text-xs text-neutral-500">followers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log('Follow user:', user.id);
                                        }}
                                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30"
                                    >
                                        Follow
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-neutral-700 font-semibold text-lg mb-2">
                            No trending developers yet
                        </p>
                        <p className="text-neutral-500 text-sm text-center max-w-md">
                            Check back soon to discover active contributors in the community
                        </p>
                    </div>
                )}
            </div>

            {users?.length > 0 && (
                <div className="p-6 pt-0">
                    <Link
                        href="/explore/users"
                        className="block w-full text-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 font-medium hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200/50"
                    >
                        View All Developers
                        <svg className="inline-block w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TrendingUsers;
