import Header from '@components/Header'
import CardPost from '@components/CardPost'
import TrendingUsers from '@components/TrendingUsers'
import TrendingDevlogs from '@components/TrendingDevlogs'
import Hero from '@components/Hero'
import FilterSection from '@/components/FilterSection'
import { fetchFilteredPosts } from '@lib/fetchPostsByTagNCategory'
import type { Post } from '@/types/post'
import { fetchUser } from '@/lib/fetchUser'
import Link from 'next/link';

const allTags = ['react', 'node', 'javascript', 'typescript']
const allCategories = ['frontend', 'backend', 'devops', 'design']

const Home = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] }> }) => {
	const searchParamsNew = await searchParams
	const tags = Array.isArray(searchParamsNew?.tag) ? searchParamsNew.tag : searchParamsNew?.tag ? [searchParamsNew.tag] : []
	const categories = Array.isArray(searchParamsNew?.category) ? searchParamsNew.category : searchParamsNew?.category ? [searchParamsNew.category] : []

	const posts = await fetchFilteredPosts(tags, categories)
	const user = await fetchUser()


	return (
		<div>
			<Header />
			<div className="min-h-[100vh] w-full flex flex-col items-center pt-16 px-4 pb-16">
				{user ?
				
					<div className="p-8 bg-white rounded-xl shadow max-w-5xl w-full text-center">
						<img src={user.profileImgUrl} alt={user.name} className="mx-auto rounded-full w-24 h-24 mb-4 object-cover" />
						<h2 className="text-2xl font-semibold mb-2">Welcome back, {user.name}!</h2>
						<p className="text-gray-600 mb-6">Check out your latest devlogs or start a new entry.</p>
						<div className="flex justify-center gap-4">
							<Link href="/create-post" className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition">New Devlog</Link>
							<Link href="/profile" className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">My Profile</Link>
						</div>
					</div>
					:
					<Hero />
				}
				

				<div className="mt-10 w-full max-w-5xl flex flex-col gap-6">
					<FilterSection label={'tag'} values={allTags} paramKey={'tag'} activeValues={tags} searchParams={searchParamsNew}/>
					<FilterSection label={'category'} values={allCategories} paramKey={'category'} activeValues={categories} searchParams={searchParamsNew}/>
				</div>

				<div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
					{!posts ? (
						<div className="text-red-600 text-center col-span-full">Error loading posts. Please try again later.</div>
					) : posts.length > 0 ? (
						posts.map((post: Post, index: number) => <CardPost key={index} post={post} />)
					) : (
						<div className="text-gray-600 text-center col-span-full">No posts found for this filter.</div>
					)}
				</div>

				<div className="w-full max-w-6xl mt-16 grid md:grid-cols-2 gap-10">
					<TrendingUsers />
					<TrendingDevlogs />
				</div>
			</div>
		</div>
	)
}

export default Home
