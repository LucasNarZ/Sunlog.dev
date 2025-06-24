import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { apiClient } from "../apiClient"

const useFollow = (followedId: string):[boolean | null, Dispatch<SetStateAction<boolean | null>>, unknown] => {
    const [ error, setError ] = useState<unknown>(null);
    const [ response, setResponse ] = useState<boolean | null>(null);
    useEffect(() => {
        (async () => {
            try{
                const response = await apiClient.get(`/user/follow/${followedId}`);
                setResponse(response.data);
            }catch(err){
                setError(err);
            }
        })()
    }, [followedId])

    return [ response, setResponse, error ];
}

export default useFollow;