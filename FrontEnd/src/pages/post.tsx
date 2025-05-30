import Header from '../components/header';
import { useParams } from 'react-router-dom';
import usePost from '../hooks/getPost';
import type { Post } from '../types/post';
import useAuthor from '../hooks/getAuthor';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const Post = () => {
    const { postId } = useParams<{ postId: string }>()
    const [ post, postError ] = usePost(postId as string)
    const [ author, authorError ] = useAuthor(post?.userId as string);
    if(postError){
        console.error(postError)   
    }
    if(authorError){
        console.error(authorError)
    }
    return (
        <div className='w-[100vw] flex flex-col items-center'>
            <Header />
            {post ? 
            <div className="flex flex-col max-w-3xl w-[90vw] pt-32">
                <h1 className='text-3xl font-bold'>{post.title}</h1>
                <div className="flex gap-4 h-20 items-center">   
                    <div className='flex items-center gap-3'>
                        <img className='w-9 rounded-4xl' src={author?.profileImgUrl} alt="author profile image" />
                        <p>{author?.name}</p>
                    </div>
                </div>
                <div className='prose'>
                    <ReactMarkdown
                        children={post?.content}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]} 
                    />
                </div>
            </div>
            
            : <div>Loading...</div>}
        </div>
    );
}

export default Post;