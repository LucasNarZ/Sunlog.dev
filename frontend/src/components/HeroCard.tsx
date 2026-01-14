import Link from 'next/link';

const HeroCard = () => {
	return (
		<section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow p-8 flex flex-col items-center text-center">
			<h1 className="text-4xl font-bold mb-4">
				Join the Devlog Community
			</h1>
			<p className="text-lg max-w-xl mb-6">
				Share your coding journey, follow other developers, and grow
				together. Create devlogs, get feedback, and inspire!
			</p>
			<Link
				href="/sign-up"
				className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
			>
				Get Started
			</Link>
		</section>
	);
};

export default HeroCard;
