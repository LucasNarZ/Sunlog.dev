"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/apiClient"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"
import { Post } from "@/types/post"
import useLike from "@/hooks/getLike"

export default function PostInteractions({
  user,
  post,
  initialFollowing
}: {
  user: User
  post: Post
  initialFollowing: boolean
}) {
  const [liked, setLiked] = useLike(post.id);
  const [following, setFollowing] = useState(initialFollowing);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [ loggedUserId, setLoggedUserId ] = useState(null);

  useEffect(() => {
    (async () => {
      try{
          const { data } = await apiClient.get("/user/me/id", {
              withCredentials: true
          });
          setLoggedUserId(data);
      }catch(err) {
          console.log(err)
          setLoggedUserId(null)
      }
    })()
  }, [])

  const router = useRouter()
  console.log(loggedUserId)

  const handleAuthorClick = () => {
    router.push(`/user/${user.id}`)
  }

  const handleLike = async () => {
    try {
      if (liked) {
        await apiClient.post("/post/unlike", { likedId: post.id }, { withCredentials: true })
        setLikesCount((c) => c - 1)
      } else {
        await apiClient.post("/post/like", { likedId: post.id }, { withCredentials: true })
        setLikesCount((c) => c + 1)
      }
      setLiked(!liked)
    } catch(err) {
      console.log(err)
      router.push("/sign-in")
    }
  }

  const handleFollow = async () => {
    try {
      if (following) {
        await apiClient.post("/user/unfollow", { followedId: user.id }, { withCredentials: true })
      } else {
        await apiClient.post("/user/follow", { followedId: user.id }, { withCredentials: true })
      }
      setFollowing(!following)
    } catch {
      router.push("/sign-in")
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4 cursor-pointer" onClick={handleAuthorClick}>
        <Image
          src={user?.profileImgUrl || "https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png"}
          alt="Author"
          className="w-12 h-12 rounded-full object-cover border shadow"
          width={48}
          height={48}
          unoptimized
        />
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {(!loggedUserId || loggedUserId !== post.userId) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFollow()
            }}
            className={`ml-auto px-4 py-1 rounded-full font-semibold text-white transition cursor-pointer ${following ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="flex gap-4 items-center mb-6 text-gray-700 flex-wrap">
        <div><strong>Category:</strong> {post.category || "General"}</div>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition cursor-pointer ${liked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 -translate-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-5-4-7-8a4 4 0 118 0 4 4 0 018 0c-2 4-7 8-7 8z" />
          </svg>
          {likesCount}
        </button>
      </div>
    </>
  )
}
