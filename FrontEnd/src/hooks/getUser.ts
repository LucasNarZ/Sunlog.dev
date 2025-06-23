import { useEffect, useState } from "react"
import { apiClient } from "../apiClient"
import type { User } from "../types/user"

const useUser = (userId:string):[User | null, unknown] => {
    const [ error, setError ] = useState<unknown>(null);
    const [ response, setResponse ] = useState<User | null>(null);
    useEffect(() => {
        (async () => {
            try{
                const response = await apiClient.get(`/user/` + userId)
                setResponse(response.data)
            }catch(err){
                console.log(err)
                setError(err)
            }
        })()
    }, [])

    return [ response, error ]
}

export default useUser