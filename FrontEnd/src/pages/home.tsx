import Header from '../components/header'
import CardPost from '../components/cardPost'
import { usePostsByTag } from '../hooks/getFilteredPosts'
import { useSearchParams } from 'react-router-dom'
import type { Post } from '../types/post'

const Home = () => {
  const [ searhParams ] = useSearchParams()
  const [ posts, errorPosts ] = usePostsByTag(searhParams.getAll("tag"))
  
  if(errorPosts){
    console.error(errorPosts)
  }

  return (
    <div>
      <Header />
      <div className='w-full flex flex-col items-center pt-12'>
          <h1 className='text-5xl text-center font-family-garamond'>Welcome to The Learning Experience</h1>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-1 w-10/12 max-w-4xl pt-12'>
          {posts ? posts.map((post:Post, index:number) => {
            return (
              <CardPost key={index} post={post} />
            )
          }): <div>Loading...</div>}

          </div>
      </div>
    </div>
  )
}

export default Home