import React from 'react';
import Header from '../components/header';
import { useParams } from 'react-router-dom';
import usePost from '../hooks/getPost';
import type { Post } from '../types/post';

const Post = () => {
    const { postId } = useParams<{ postId: string }>()
    const [ post, error ] = usePost(postId as string)
    if(error){
        console.error(error)   
    }
    console.log(post)
    return (
        <React.Fragment>
            <Header />
            {post ? <div>{post.title}</div> : <div>Loading...</div>}
        </React.Fragment>
    );
}

export default Post;