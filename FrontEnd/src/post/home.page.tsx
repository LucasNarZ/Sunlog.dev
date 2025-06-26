import Header from '../shared/header';
import CardPost from './components/cardPost';
import { usePostsByTag } from './hooks/getFilteredPosts';
import { useSearchParams } from 'react-router-dom';
import type { Post } from './types/post';
import { useMemo } from 'react';
import Footer from '../shared/footer';

const allTags = ['react', 'node', 'javascript', 'typescript'];
const allCategories = ['frontend', 'backend', 'devops', 'design'];

const Home = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const tags = searchParams.getAll('tag');
	const categories = searchParams.getAll('category');
	const searchQuery = searchParams.get('search')?.toLowerCase() || '';

	const [posts, errorPosts] = usePostsByTag([...tags, ...categories]);

	const filteredPosts = useMemo(() => {
		if (!posts) return [];
		return posts.filter(
			(post: Post) =>
				post.title.toLowerCase().includes(searchQuery) ||
				post.description.toLowerCase().includes(searchQuery),
		);
	}, [posts, searchQuery]);

	const toggleParam = (key: string, value: string) => {
		const current = new Set(searchParams.getAll(key));
		if (current.has(value)) current.delete(value);
		else current.add(value);
		searchParams.delete(key);
		current.forEach((v) => searchParams.append(key, v));
		setSearchParams(searchParams);
	};

	return (
		<div>
			<Header />
			<div className="min-h-[100vh] w-full flex flex-col items-center pt-16 px-4">
				<h1 className="text-4xl sm:text-5xl text-center font-serif font-semibold tracking-tight">
					Welcome to{' '}
					<span className="text-primary">
						The Learning Experience
					</span>
				</h1>

				<div className="mt-10 w-full max-w-5xl flex flex-col gap-4">
					<div className="flex flex-wrap gap-2 justify-center">
						{allTags.map((tag) => (
							<button
								key={tag}
								className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
									tags.includes(tag)
										? 'bg-indigo-500 text-white border-indigo-500'
										: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
								}`}
								onClick={() => toggleParam('tag', tag)}
							>
								#{tag}
							</button>
						))}
					</div>

					<div className="flex flex-wrap gap-2 justify-center">
						{allCategories.map((category) => (
							<button
								key={category}
								className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
									categories.includes(category)
										? 'bg-purple-500 text-white border-purple-500'
										: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
								}`}
								onClick={() =>
									toggleParam('category', category)
								}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				<div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
					{errorPosts ? (
						<div className="text-red-600 text-center col-span-full">
							Error loading posts. Please try again later.
						</div>
					) : !posts ? (
						<div className="text-gray-500 text-center col-span-full">
							Loading posts...
						</div>
					) : filteredPosts.length > 0 ? (
						filteredPosts.map((post: Post, index: number) => (
							<CardPost key={index} post={post} />
						))
					) : (
						<div className="text-gray-600 text-center col-span-full">
							No posts found for this filter.
						</div>
					)}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
