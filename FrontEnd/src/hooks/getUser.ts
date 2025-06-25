import { useEffect, useState } from "react"
import { apiClient } from "../apiClient"
import type { User } from "../types/user"

const useUser = (userId:string | undefined, refreshUserKey?: number):[User | null, unknown] => {
    const [ error, setError ] = useState<unknown>(null);
    const [ response, setResponse ] = useState<User | null>(null);
    useEffect(() => {
        
        (async () => {
            console.log("asdasdasd")
            if(!userId) return
            try{
                const response = await apiClient.get(`/user/` + userId)
                setResponse(response.data)
            }catch(err){
                console.log(err)
                setError(err)
            }
        })()
    }, [userId, refreshUserKey])

    return [ response, error ]
}

export default useUser