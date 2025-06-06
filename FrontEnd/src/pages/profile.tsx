import { useNavigate } from "react-router-dom"
import Header from "../components/header"
import useAuthor from "../hooks/getAuthor"
import useGetProfile from "../hooks/getProfile"
import usePostsByAuthor from "../hooks/getUserPosts"
import CardPost from "../components/cardPost"


const Profile = () => {
    const navigate = useNavigate()

    const [ userData, errorProfile ] = useGetProfile()

    if(errorProfile || !userData){
        navigate("/signIn")
    }

    const [ user, errorUser ] = useAuthor(userData?.userId ?? "")

    const [ posts, errorPosts ] = usePostsByAuthor(userData?.userId ?? "")
    

    const handleClick = () => {
        navigate("/editor")
    }

    return (
        <div className="flex flex-col items-center w-full">
            <Header />
            <div className="flex w-full pt-12">
                <div className="w-2/7 flex justify-center">
                    <img className="w-40 h-40" src={user?.profileImgUrl} alt="profile pic" />
                </div>
                <div className="w-full flex flex-col">
                    <p className="text-2xl">{user?.name}</p>
                    <p className="opacity-80">{user?.email}</p>
                    
                    <div className="w-full flex flex-col items-center">
                        {posts ? 
                        <div>
                            <p className="">Posts</p>
                            {posts?.map((post, index) => {
                                return (
                                    <CardPost key={index} post={post} />
                                )
                            })}
                        </div>
                        : 
                        <div className="w-full flex flex-col items-center gap-4">
                            <p className="">You dont have posts yet</p>
                            <p className="">Start posting, learn and teach others</p>
                            <button className="cursor-pointer border-1 p-1" onClick={ handleClick }>Post Now</button>
                        </div>
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Profile