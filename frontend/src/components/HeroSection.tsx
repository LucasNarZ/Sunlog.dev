'use client';

import Link from 'next/link';
import HeroCard from './HeroCard';
import useUserProfile from '@/features/users/hooks/useUserProfile';

const HeroSection = () => {
	const [user, error, loading] = useUserProfile();

	return (
		<>
			{loading ? (
				<div className="max-w-5xl w-full bg-gray-100 animate-pulse rounded-xl" />
			) : user && !error ? (
				<div className="p-8 bg-white rounded-xl shadow max-w-5xl w-full text-center">
					<img
						src={user.profileImgUrl}
						alt={user.name}
						className="mx-auto rounded-full w-24 h-24 mb-4 object-cover"
					/>
					<h2 className="text-2xl font-semibold mb-2">
						Welcome back, {user.name}!
					</h2>
					<p className="text-gray-600 mb-6">
						Check out your latest devlogs or start a new entry.
					</p>
					<div className="flex justify-center gap-4">
						<Link
							href="/devlogs/create"
							className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition"
						>
							New Devlog
						</Link>
						<Link
							href={`/${user?.name}`}
							className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
						>
							My Profile
						</Link>
					</div>
				</div>
			) : (
				<HeroCard />
			)}
		</>
	);
};

export default HeroSection;
