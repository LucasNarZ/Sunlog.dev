import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Post from './pages/post'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Profile from './pages/profile'
import CreatePost from './pages/createPost'
import EditPost from './pages/editPost'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route path='/signIn' element={<SignIn />}/>
        <Route path='/signUp' element={<SignUp />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/createPost' element={<CreatePost />}/>
        <Route path='/editPost/:postId' element={<EditPost />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
