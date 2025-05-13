import { useEffect, useState } from "react"
import { apiClient } from "../apiClient"
import type { Post } from "../types/post";

export const usePostsByTag = (tags:string[]):[Post[] | null, unknown] => {
    const [ posts, setPosts ] = useState<Post[] | null>(null);
    const [ error, setError ] = useState<unknown>(null);
    const endpoint = tags?.length == 0 ? "/post" : "/post?" + "&tag=" + tags.join("&tag=")
    useEffect(() => {
        (async () => {
            try{                
                const response = await apiClient.get(endpoint);
                setPosts(response.data);
            }catch(err){
                console.error(err)
                setError(err)
            }
        })()
    }, [endpoint])

    return [ posts, error ]
}

