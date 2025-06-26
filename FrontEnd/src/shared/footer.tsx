import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="w-full bg-gray-100 border-t border-gray-200 text-gray-700 py-8 px-6 lg:px-16">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-sm font-family-garamond text-center md:text-left">
					© {new Date().getFullYear()} The Learning Experience. All
					rights reserved.
				</p>
				{/* <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/about" className="hover:text-primary transition">About</Link>
          <Link to="/contact" className="hover:text-primary transition">Contact</Link>
          <Link to="/privacy" className="hover:text-primary transition">Privacy</Link>
        </div> */}
			</div>
		</footer>
	);
};

export default Footer;
