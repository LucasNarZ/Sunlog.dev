import { useEffect, useState } from "react"
import { Post } from "../types/post"
import { apiClient } from "../apiClient"

const usePostsByAuthor = (userId:string):[ Post[] | null, unknown | null ] => {
    const [ posts, setPosts ] = useState<Post[] | null>(null)
    const [ error, setError ] = useState<unknown | null>(null)
    
    useEffect(() => {
        (async () => {
            try{
                const response = await apiClient.get("/user/" + userId + "/posts")
                setPosts(response.data)
            }catch(err){
                setError(err)
            }
        })()
    }, [])

    return [ posts, error ]
}

export default usePostsByAuthor