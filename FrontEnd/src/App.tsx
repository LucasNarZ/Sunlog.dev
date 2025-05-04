import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Post from './pages/post'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
