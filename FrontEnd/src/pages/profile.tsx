import { redirect, useNavigate } from "react-router-dom"
import Header from "../components/header"
import useAuthor from "../hooks/getAuthor"
import useGetProfile from "../hooks/getProfile"

const Profile = () => {
    const [ userData, errorProfile ] = useGetProfile()
    const [ user, errorUser ] = useAuthor(userData?.userId ?? "")
    const navigate = useNavigate()

    if(errorProfile){
        navigate("/signIn")
    }

    return (
        <div>
            <Header />
            {user?.name}
        </div>
    )
}

export default Profile