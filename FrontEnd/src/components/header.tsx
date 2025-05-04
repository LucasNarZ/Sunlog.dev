import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
    return (
        <header className="h-16 w-full flex justify-between items-center">
            <div className="flex items-center justify-start gap-16 w-2/3">
                <div className="flex items-center ml-10">
                    <h1 className="">Endless Learning</h1>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded px-4 py-2 w-1/2" />
                    <SearchIcon />
                </div>
            </div>
            <div className="flex justify-between w-36 justify-self-end mr-10">
                <button className="">Sign Up</button>
                <button className="">Sign In</button>
            </div>

        </header>
    )
}

export default Header;