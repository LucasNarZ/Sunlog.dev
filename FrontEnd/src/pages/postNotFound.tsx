import { Link } from 'react-router-dom';
import Header from '../components/header';

export default function PostNotFound() {
	return (
		<>
			<Header />
			<div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-8 bg-gray-50">
				<h1 className="text-5xl font-bold text-primary">
					Post Not Found
				</h1>
				<p className="mt-4 text-gray-700 font-family-garamond text-lg">
					This post may have been removed or never existed.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition"
				>
					Browse other posts
				</Link>
			</div>
		</>
	);
}
