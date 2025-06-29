import Header from '@components/Header';
import CardPost from '@components/CardPost';
import { fetchFilteredPosts } from '@lib/fetchPostsByTagNCategory';
import type { Post } from '@/types/post';
import Footer from '@components/Footer';
import Link from 'next/link';
import { createURLSearchParams } from '@utils/createURLSearchParams';

const allTags = ['react', 'node', 'javascript', 'typescript'];
const allCategories = ['frontend', 'backend', 'devops', 'design'];

const Home = async ({ searchParams }: { searchParams: { [key: string]: string | string[] } }) => {
	const tags = Array.isArray(searchParams?.tag) ? searchParams.tag : searchParams?.tag ? [searchParams.tag] : []
	const categories = Array.isArray(searchParams?.category) ? searchParams.category : searchParams?.category ? [searchParams.category] : []

	const posts = await fetchFilteredPosts(tags, categories);

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
						{allTags.map((tag) => {
							const params = createURLSearchParams(searchParams)
							const currentTags = new Set(params.getAll('tag'))

							if (currentTags.has(tag)) currentTags.delete(tag)
							else currentTags.add(tag)

							params.delete('tag')
							currentTags.forEach(t => params.append('tag', String(t)))

							return <Link
								key={tag}
								className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
									tags.includes(tag)
										? 'bg-indigo-500 text-white border-indigo-500'
										: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
								}`}
								href={`?${params.toString()}`}
							>
								#{tag}
							</Link>
						})}
					</div>

					<div className="flex flex-wrap gap-2 justify-center">
						{allCategories.map((category) => {
							const params = createURLSearchParams(searchParams)
							const currentCategories = new Set(params.getAll('category'))

							if (currentCategories.has(category)) currentCategories.delete(category)
							else currentCategories.add(category)

							params.delete('category')
							currentCategories.forEach(t => params.append('category', t))

							return <Link
								key={category}
								className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
									tags.includes(category)
										? 'bg-indigo-500 text-white border-indigo-500'
										: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
								}`}
								href={`?${params.toString()}`}
							>
								{category}
							</Link>
						})}
					</div>
				</div>

				<div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
					{!posts ? (
						<div className="text-red-600 text-center col-span-full">
							Error loading posts. Please try again later.
						</div>
					) : !posts ? (
						<div className="text-gray-500 text-center col-span-full">
							Loading posts...
						</div>
					) : posts.length > 0 ? (
						posts.map((post: Post, index: number) => (
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
