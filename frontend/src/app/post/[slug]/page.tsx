import Header from '@components/Header';
import { redirect } from "next/navigation"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { getLike } from '@/lib/getLike';
import { getAuthor } from '@/lib/fetchAuthorPost';
import { getPost } from '@/lib/getPost';
import { getFollow } from '@/lib/getFollow';
import { getIsUserLoggedUser } from '@/lib/getIsUserLogged';
import PostInteractions from '@/components/PostInteractions';

const Post = async ({ params }:{params:{slug:string}}) => {
	const slug = params.slug;
	const post = await getPost(slug)
	const user = await getAuthor(post?.userId)
	const liked = await getLike(user.id)
	const following = await getFollow(user.id)
	const loggedUserId = await getIsUserLoggedUser()

	if (!post) {
		redirect('/post-not-found');
	}

	return (
		<div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center">
			<Header />
			{post ? (
				<article className="max-w-3xl w-full px-6 sm:px-10 pb-20 mt-20 break-words">
					{post.previewImgUrl && (
						<Image
							src={post.previewImgUrl}
							alt="Post preview"
							className="w-full h-72 object-cover rounded-xl mb-8 shadow-md"
							width={0}
							height={0}
							unoptimized
						/>
					)}
					<h1 className="text-4xl font-extrabold mb-4 leading-tight font-family-garamond">
						{post.title}
					</h1>
					<PostInteractions
						user={user}
						post={post}
						initialLiked={liked}
						initialFollowing={following}
						initialLikesCount={post.likes || 0}
						loggedUserId={loggedUserId}
					/>
					<div className="prose prose-lg max-w-none leading-relaxed font-serif text-gray-800">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw]}
						>
							{post.content}
						</ReactMarkdown>
					</div>
				</article>
			) : (
				<div className="mt-40 text-xl font-medium text-gray-600">
					Loading...
				</div>
			)}
		</div>
	);
};

export default Post;
