import Header from '../components/header'
import CardPost from '../components/cardPost'
import { usePostsByTag } from '../hooks/getFilteredPosts'
import { useSearchParams } from 'react-router-dom'
import type { Post } from '../types/post'

const Home = () => {
  const [ searhParams, setSearchParams ] = useSearchParams()
  const [ posts, errorPosts ] = usePostsByTag(searhParams.getAll("tag"))
  
  if(errorPosts){
    console.error(errorPosts)
  }

  return (
    <div>
      <Header />
      <div className='w-full flex flex-col items-center pt-12'>
          {posts ? posts.map((post:Post, index:number) => {
            return (
              <CardPost key={index} post={post} />
            )
          }): <div>Loading...</div>}
      </div>
    </div>
  )
}

export default Home