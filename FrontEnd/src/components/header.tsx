import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

    return (
        <header className="h-16 w-full flex justify-between items-center">
            <div className="flex items-center justify-start gap-16 w-2/3">
                <div className="flex items-center ml-10 w-40">
                    <h1  style={{ fontFamily: "'EB Garamond', serif" }} className='w-full'>The Learning Experience</h1>
                </div>
                <div className="w-full">
                    <div className='relative w-2/3 md:opacity-100 opacity-0'>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded px-4 py-2 w-full" />
                        <SearchIcon className='absolute right-5 top-1/2 translate-y-[-50%] cursor-pointer'/>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-36 justify-self-end lg:mr-16 mr-5">
                <button className="cursor-pointer" onClick={() => navigate("/signUp")}>Sign Up</button>
                <button className="cursor-pointer" onClick={() => navigate("/signIn")}>Sign In</button>
            </div>
        </header>
    )
}

export default Header;