import Image from 'next/image';
import Link from 'next/link';
import { getTrendingUsers } from '@/features/users/services/getTrendingUsers';

const TrendingUsers = async () => {
    const users = await getTrendingUsers();
    const placeholderImage =
        'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png';

    return (
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-neutral-200 bg-gradient-to-r from-white via-neutral-50 to-white px-6 py-6 sm:px-8">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-primary to-blue-500" />
                    <div>
                        <h2 className="text-3xl font-bold text-neutral-900">
                            Trending Developers
                        </h2>
                        <p className="mt-1 text-neutral-600">
                            Developers getting the most attention right now
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {users?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {users.map((user, index) => (
                            <Link
                                key={user.id}
                                href={`/${user.slug}`}
                                className="group"
                            >
                                <div className="h-full rounded-2xl border border-primary/15 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                                            #{index + 1} em alta
                                        </span>
                                        <span className="text-sm font-medium text-neutral-400 transition group-hover:text-primary">
                                            Ver perfil →
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="relative shrink-0">
                                            <div className="h-16 w-16 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-sm transition group-hover:border-primary/30">
                                                <Image
                                                    src={user.profileImgUrl || placeholderImage}
                                                    alt={user.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-semibold text-neutral-900 transition group-hover:text-primary">
                                                {user.name}
                                            </h3>
                                            <p className="truncate text-sm text-neutral-500">
                                                @{user.slug}
                                            </p>
                                            <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
                                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                    <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                    <span className="font-semibold text-neutral-900">
                                                        {user.followersNumber.toLocaleString()}
                                                    </span>
                                                    <span>followers</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 shadow-inner">
                            <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="mb-2 text-lg font-semibold text-neutral-700">
                            No trending developers yet
                        </p>
                        <p className="max-w-md text-center text-sm text-neutral-500">
                            Check back soon to discover active contributors in the community
                        </p>
                    </div>
                )}
            </div>

            {users?.length > 0 && (
                <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
                    <Link
                        href="/explore/users"
                        className="block w-full rounded-2xl border border-primary/15 bg-neutral-50 px-4 py-3 text-center font-medium text-primary transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                    >
                        View All Developers
                        <svg className="ml-2 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TrendingUsers;
