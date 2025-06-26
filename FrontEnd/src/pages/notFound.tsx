import { Link } from 'react-router-dom';
import Header from '../shared/header';

export default function NotFound() {
	return (
		<>
			<Header />
			<div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-8 bg-gray-50">
				<h1 className="text-6xl font-bold text-primary">404</h1>
				<p className="mt-4 text-xl text-gray-700 font-family-garamond">
					Page Not Found
				</p>
				<p className="mt-2 text-gray-500 text-sm">
					The page you're looking for doesn't exist or was removed.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition"
				>
					Go back to homepage
				</Link>
			</div>
		</>
	);
}
