import { useEffect, useState } from "react"
import { apiClient } from "../apiClient"
import type { User } from "../types/user"

const useAuthor = (authorId: string):[User | null, unknown] => {
    const [ error, setError ] = useState<unknown>(null);
    const [ response, setResponse ] = useState<User | null>(null);
    useEffect(() => {
        if(authorId){
            (async () => {
                try{
                    const response = await apiClient.get(`/user/${authorId}`)
                    setResponse(response.data)
                }catch(err){
                    console.log(err)
                    setError(err)
                }
            })()
        }
    }, [authorId])

    return [ response, error ]
}

export default useAuthor