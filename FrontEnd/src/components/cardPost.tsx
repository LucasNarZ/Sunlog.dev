import useAuthor from "../hooks/getAuthor"
import { Post } from "../types/post"

interface CardPostProps {
    post: Post
}

const CardPost = ({ post }:CardPostProps) => {
    const creationData = new Date(post.createdAt)
    const [ author, error ] = useAuthor(post.userId)
    if(error){
        console.error(error)
    }
    return (
        <div className="w-10/12 max-w-[510px] flex justify-between border-1 p-6 rounded-3xl border-gray-100">
            <div className="flex flex-col">
                <div className="flex items-center gap-5">
                    <img className="w-7 aspect-auto" src={author?.profileImgUrl} alt="profilePic" />
                    <p className="text-md">{author?.name}</p>
                    <p className="text-sm opacity-60">{creationData.getDate()} / {creationData.getMonth() + 1}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl">{post.title}</p>
                    <p className="text-xs opacity-85">{post.description}</p>
                </div>
            </div>

            <img className="w-24 aspect-auto mr-5" src={post.previewImgUrl} alt="" />

        </div>
    )
}

export default CardPost