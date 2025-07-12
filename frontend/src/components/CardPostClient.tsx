'use client'

import { Post } from '@/types/post'
import { Heart, Trash } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import useAuthor from '@/hooks/getAuthor'

interface CardPostProps {
	post: Post
	showDelete?: boolean
	onDeleteClick?: () => void
}

const CardPostClient = ({ post, showDelete = true, onDeleteClick }: CardPostProps) => {
	const creationDate = new Date(post.createdAt)
	const [author] = useAuthor()

	return (
		<Link href={'/post/' + post.slug}>
			<div className="w-11/12 max-w-[600px] bg-white hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 p-5 rounded-3xl border border-gray-200 cursor-pointer">
				<div className="flex flex-col gap-3 flex-1 min-w-0">
					<div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
						<Image className="rounded-full object-cover" src={author?.profileImgUrl || 'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png'} alt="profilePic" width={32} height={32} />
						<span className="font-medium break-words">{author?.name}</span>
						<span className="text-gray-400">•</span>
						<span>{creationDate.getDate().toString().padStart(2, '0')}/{(creationDate.getMonth() + 1).toString().padStart(2, '0')}</span>
						<div className="flex items-center gap-1 text-sm text-gray-500">
							<Heart className="w-4 h-4" />
							{post.likes ?? 0}
						</div>
						{showDelete && onDeleteClick && (
							<button onClick={(e) => { e.preventDefault(); onDeleteClick() }} className="cursor-pointer ml-auto text-red-500 hover:text-red-700">
								<Trash className="w-4 h-4" />
							</button>
						)}
					</div>
					<div className="flex flex-col gap-1 min-w-0">
						<p className="text-lg font-semibold text-gray-900 break-words line-clamp-2">{post.title}</p>
						<p className="text-sm text-gray-600 break-words line-clamp-3">{post.description}</p>
					</div>
				</div>
				{post.previewImgUrl && (
					<Image className="rounded-xl object-cover" src={post.previewImgUrl} alt="post preview" width={112} height={112} unoptimized />
				)}
			</div>
		</Link>
	)
}

export default CardPostClient
