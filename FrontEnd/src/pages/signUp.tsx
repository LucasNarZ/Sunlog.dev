import { useState } from "react"
import { apiClient } from "../apiClient"
import { useNavigate, Link } from "react-router-dom"

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
            const response = await apiClient.post("/auth/register", body)
            if(response.status == 201){
                navigate("/signIn")
            }
        }catch(err){
            console.error(err)
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-gray-200">
            <div className="flex bg-white w-11/12 max-w-[1000px] h-[600px] rounded-2xl overflow-hidden gap-y-7">
                <form className="w-1/2 flex flex-col items-center gap-7 pt-15" onSubmit={handleSubmit}>
                    <p className="self-center text-3xl">Welcome</p>
                    <div className="flex flex-col w-6/7">
                        <label>Name</label>
                        <input type="text" className="border-1 rounded h-11 p-4" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-6/7">
                        <label>Email</label>
                        <input type="email" className="border-1 rounded h-11 p-4" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-6/7">
                        <label>Password</label>
                        <input type="password" className="border-1 rounded h-11 p-4" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="mt-auto mb-12">
                        <input type="submit" value="Create Account" className="cursor-pointer border-1-white text-white w-70 h-10 rounded-xl bg-primary"/>
                        <p className="text-sm opacity-40">Already have an account? <Link to="/signIn" className="text-blue-700 cursor-pointer">Sign In</Link></p>
                    </div>
                </form>
                <div className="w-1/2 bg-[#6E69FF] text-white font-[EB-Garamont] flex flex-col items-center justify-around">
                    <p className="text-2xl text-center">Begin Your <br /> Learning Experience</p>
                    <h1 className="text-6xl text-center leading-18">Create, <br /> Share,  <br /> Learn</h1>
                    <p className="">Where Creativity has no limits</p>
                </div>

            </div>
        </div>
    )
}

export default SignUp