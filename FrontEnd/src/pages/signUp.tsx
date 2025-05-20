import { useState } from "react"
import { apiClient } from "../apiClient"
import { useNavigate } from "react-router-dom"

const SignUp = () => {
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try{
            const body = {
                name,
                email,
                password
            }
            const response = await apiClient.post("/user/register", body)
            if(response.status == 201){
                navigate("/profile")
            }
        }catch(err){
            console.error(err)
        }
    }

    return (
        <form className="h-[100vh] w-[100vw] flex justify-center items-center bg-gray-200" onSubmit={handleSubmit}>
            <div className="flex flex-col bg-white w-11/12 max-w-96 h-[600px] rounded p-10 gap-y-7">
                <p className="self-center text-2xl">SignUp</p>
                <div className="flex flex-col">
                    <label>Name</label>
                    <input type="text" className="border-1 rounded" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input type="text" className="border-1 rounded" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="flex flex-col">
                    <label>Password</label>
                    <input type="text" className="border-1 rounded" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input type="submit" value="Sign Up" className="cursor-pointer border-1 w-34 self-center mt-auto"/>
            </div>
        </form>
    )
}

export default SignUp