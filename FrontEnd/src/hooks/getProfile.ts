import { useEffect, useState } from "react"
import { apiClient } from "../apiClient"
import { UserPayload } from "../types/userPayload";
import { AxiosError } from "axios";

const useGetProfile = ():[UserPayload | null, unknown | null] => {
    const [ userData, setUserData ] = useState<UserPayload | null>(null);
    const [ error, setError ] = useState<unknown | null>(null);
    useEffect(() => {
        (async () => {
            try{
                const response = await apiClient.get("/auth/profile", {
                    withCredentials: true
                })
                setUserData(response.data)
                console.log(response?.data)
            }catch(err){
                console.error(err)
                
                setError(err)
            }
        })()
    }, [])

    return [ userData, error ]
}

export default useGetProfile