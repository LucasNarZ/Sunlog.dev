import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, Link } from 'react-router-dom';
import useAuthor from '../hooks/getAuthor';
import { useState } from 'react';

const Header = () => {
	const navigate = useNavigate();
	const [userData, errorProfile] = useAuthor();
	const [isFocused, setIsFocused] = useState(false);

	const handleClick = () => navigate('/profile');

	return (
		<header className="h-20 w-full bg-white shadow-md px-6 lg:px-16 flex items-center justify-between">
			<div className="flex items-center space-x-4">
				<Link
					to="/"
					className="text-lg lg:text-xl font-family-garamond font-semibold text-gray-800 hover:text-secondary transition"
				>
					The Learning Experience
				</Link>
			</div>

			<div
				className={`hidden md:flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 shadow-inner
          transition-all duration-300 ease-in-out
          ${isFocused ? 'w-96' : 'w-64'}`}
			>
				<SearchIcon className="text-gray-500" />
				<input
					type="text"
					placeholder="Search posts, topics..."
					className="ml-2 bg-transparent outline-none w-full text-sm"
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
			</div>

			<div className="flex items-center space-x-6">
				{errorProfile ? (
					<>
						<button
							onClick={() => navigate('/signUp')}
							className="cursor-pointer text-sm font-semibold text-primary hover:text-secondary transition"
						>
							Sign Up
						</button>
						<button
							onClick={() => navigate('/signIn')}
							className="cursor-pointer bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-secondary transition font-semibold"
						>
							Sign In
						</button>
					</>
				) : (
					<div
						onClick={handleClick}
						className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
					>
						<img
							src={userData?.profileImgUrl}
							alt="Profile"
							className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow"
						/>
						<span className="text-sm font-semibold text-gray-700">
							{userData?.name}
						</span>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
