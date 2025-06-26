import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './post/home.page';
import Post from './post/post.page';
import SignIn from './user/signIn.page';
import SignUp from './user/signUp.page';
import Profile from './user/profile.page';
import CreatePost from './post/createPost.page';
import EditPost from './post/editPost.page';
import PublicUser from './user/publicUser.page';
import NotFound from './pages/notFound';
import PostNotFound from './pages/postNotFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/post/:slug" element={<Post />} />
				<Route path="/signIn" element={<SignIn />} />
				<Route path="/signUp" element={<SignUp />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/create-post" element={<CreatePost />} />
				<Route path="/edit-post/:postId" element={<EditPost />} />
				<Route path="/user/:id" element={<PublicUser />} />
				<Route path="/post-not-found" element={<PostNotFound />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
