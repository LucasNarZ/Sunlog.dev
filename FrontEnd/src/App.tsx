import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Post from './pages/post'
import SignIn from './pages/SignIn'
import SignUp from './pages/signUp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path='/SignIn' element={<SignIn />}/>
        <Route path='/SignUp' element={<SignUp />}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
