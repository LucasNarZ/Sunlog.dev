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
        <div className="w-10/12 max-w-96 flex flex-col">
            <div>{post.title}</div>
            <div>{author?.name}</div>
            <div>{creationData.getDay() + 1} / {creationData.getMonth() + 1}</div>
        </div>
    )
}

export default CardPost