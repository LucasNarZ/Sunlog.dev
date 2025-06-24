import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "../components/header"
import useUser from "../hooks/getUser"
import usePostsByAuthor from "../hooks/getUserPosts"
import CardPost from "../components/cardPost"

const PublicUser = () => {
  const { id } = useParams()
  const [user, errorUser] = useUser(id ?? "")
  const [posts] = usePostsByAuthor(id ?? "")
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (errorUser) console.error(errorUser)
  }, [errorUser])

  const handleFollow = () => {
    setFollowing(!following)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">
      <Header />
      <div className="w-full max-w-5xl mt-12 px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
          <img className="w-32 h-32 rounded-full object-cover shadow-md" src={user?.profileImgUrl} alt="Profile" />
          <div className="text-center md:text-left w-full">
            <h2 className="text-3xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown date"}</p>
            <p className="text-sm text-gray-500">{user?.followers} follower{user?.followers === 1 ? "" : "s"}</p>
            <p className="text-gray-700 mt-3 italic max-w-xl whitespace-pre-line">{user?.bio?.trim() !== "" ? user?.bio : "No bio provided yet."}</p>
            <button onClick={handleFollow} className={`cursor-pointer mt-4 px-5 py-2 text-white rounded transition ${following ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
        <div className="w-full">
          {posts && posts.length > 0 ? (
            <>
              <h3 className="text-xl font-medium mb-4">Posts by {user?.name}</h3>
              <div className="grid gap-6">
                {posts.map((post, index) => (
                  <CardPost key={index} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center mt-10 gap-4">
              <p className="text-lg font-medium">This user hasn’t published any posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicUser
