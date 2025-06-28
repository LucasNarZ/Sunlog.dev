import Header from '../shared/header';

export default function UserNotFound() {
	return (
		<>
			<Header />
			<div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-8 bg-gray-50">
				<h1 className="text-5xl font-bold text-primary">
					User Not Found
				</h1>
				<p className="mt-4 text-gray-700 font-family-garamond text-lg">
					This user may have been deleted or never existed.
				</p>
			</div>
		</>
	);
}
