import Header from '../components/header'
import { useParams, useNavigate } from 'react-router-dom'
import usePost from '../hooks/getPost'
import useUser from '../hooks/getUser'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react'
import { apiClient } from '../apiClient'
import useFollow from '../hooks/getFollow'
import useLike from '../hooks/getLike'

const Post = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, postError] = usePost(slug)
  console.log(post?.userId)
  const [author, authorError] = useUser(post?.userId)
  const [liked, setLiked] = useLike(post?.id)
  const [likesCount, setLikesCount] = useState(post?.likes || 0)
  const [following, setFollowing, followError] = useFollow(author?.id)

  useEffect(() => {
    if (post) setLikesCount(post.likes || 0)
  }, [post])

  if (postError) console.error(postError)
  if (authorError) console.error(authorError)
  if (followError) console.error(followError)

  const handleLike = async () => {
    try{
      if(liked){
        await apiClient.post("/post/unlike", {
          likedId: post?.id
        }, {withCredentials:true})

        setLikesCount((c) => c - 1)
      }else{
        await apiClient.post("/post/like", {
          likedId: post?.id
        }, {withCredentials:true})

        setLikesCount((c) => c + 1)
      }
      setLiked(!liked)
    }catch(err){
      console.log(err)
      alert("Error on like/unlike post")
    }
  }

  const handleFollow = async () => {
    try{
      console.log(author)
      if(following){
        await apiClient.post("/user/unfollow", {
          followedId: author?.id
        }, {withCredentials:true})
      }else{
        await apiClient.post("/user/follow", {
          followedId: author?.id
        }, {withCredentials:true})
      }
      setFollowing(!following)
    }catch(err){
      console.log(err)
      alert("Error on follow/unfollow user")
    }
    
  }

  const handleAuthorClick = () => {
    if (author?.id) navigate(`/user/${author.id}`)
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-center">
      <Header />
      {post ? (
        <article className="max-w-3xl w-full px-6 sm:px-10 py-16 mt-20 mb-20">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mb-2 cursor-pointer" onClick={handleAuthorClick}>
            <img src={author?.profileImgUrl} alt="author profile" className="w-12 h-12 rounded-full object-cover border" />
            <div>
              <p className="font-semibold">{author?.name}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleFollow(); }} className={`ml-auto px-4 py-1 rounded-full font-semibold text-white transition cursor-pointer ${following ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {following ? 'Unfollow' : 'Follow'}
            </button>
          </div>
          <div className="flex gap-6 items-center mb-6 text-gray-700">
            <div><strong>Category:</strong> {post.categorys.join(", ") || 'General'}</div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="mb-6 flex items-center gap-4">
            <button onClick={handleLike} className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold transition cursor-pointer ${liked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 7 17 5 13a4 4 0 118 0 4 4 0 018 0c-2 4-7 8-7 8z" />
              </svg>
              {likesCount}
            </button>
            <div className="text-sm text-gray-500">Published: {new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="prose prose-lg max-w-none leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      ) : (
        <div className="mt-40 text-xl font-medium text-gray-600">Loading...</div>
      )}
    </div>
  )
}

export default Post
