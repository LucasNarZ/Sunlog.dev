import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
    return (
        <header className="h-16 w-full flex justify-between items-center">
            <div className="flex items-center justify-start gap-16 w-2/3">
                <div className="flex items-center ml-10">
                    <h1 className="">The Learning Experience</h1>
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
            <div className="flex justify-between w-36 justify-self-end mr-16">
                <button className="cursor-pointer">Sign Up</button>
                <button className="cursor-pointer">Sign In</button>
            </div>
        </header>
    )
}

export default Header;