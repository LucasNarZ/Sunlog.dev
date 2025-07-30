"use client";

import Link from 'next/link'
import useAuthor from '@/hooks/getAuthor';

const Header = () => {
	const [ userData ] = useAuthor()

	return (
		<header className="h-20 w-full bg-white shadow-md px-6 lg:px-16 flex items-center justify-between">
			<div className="flex items-center space-x-4">
				<Link
					href="/"
					className="text-lg lg:text-xl font-family-garamond  sm:w-auto  w-32  font-semibold text-gray-800 hover:text-secondary transition"
				>
					<img src="logo.svg" alt="logo" width={150} height={300}/>
				</Link>
			</div>


			<div className="flex items-center space-x-6">
				{!userData ? (
					<>
						<Link
							href="/sign-up"
							className="cursor-pointer text-sm font-semibold text-primary hover:text-secondary transition"
						>
							Sign Up
						</Link>
						<Link
							href="/sign-in"
							className="cursor-pointer bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-secondary transition font-semibold"
						>
							Sign In
						</Link>
					</>
				) : (
					<Link
						href='/profile'
						className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
					>
						<img
							src={userData?.profileImgUrl || "https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png"}
							alt="Profile"
							className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow"
						/>
						<span className="text-sm font-semibold text-gray-700">
							{userData?.name}
						</span>
					</Link>
				)}
			</div>
		</header>
	);
};

export default Header;
