import { API, Auth, graphqlOperation } from 'aws-amplify';
import './CreatePost.css';
import { FormEvent, useEffect, useState } from 'react';
import { createPost, CreatePostInput, CreatePostMutation } from '../graphql';

interface Props {
    
}

export const CreatePost = (props: Props) => {
    const [postOwnerId, setPostOwnerId] = useState<string>('');
    const [postOwnerUsername, setPostOwnerUsername] = useState<string>('');
    const [postTitle, setPostTitle] = useState<string>('');
    const [postBody, setPostBody] = useState<string>('');

    useEffect(()=> {
        const getUser = async () => {
         await Auth.currentUserInfo().then(user => {
                setPostOwnerId(user?.attributes?.sub);
                setPostOwnerUsername(user?.username);
            })
        }
        getUser();
    },[]);

    const addPostHandle = async (e: FormEvent) => {
        e.preventDefault();
        const input: CreatePostInput = {
            postOwnerId: postOwnerId,
            postOwnerUsername: postOwnerUsername,
            postTitle: postTitle,
            postBody: postBody,
            createdAt: new Date().toISOString()
        }
        await API.graphql(graphqlOperation(createPost, {input}))as CreatePostMutation;
        setPostBody('');
        setPostTitle('');
    }

    return (
        <div className='createPost__container'>
            <form className='createPost__form' action="" onSubmit={addPostHandle} >
                <input 
                    className='createPost__title'
                    type="text" 
                    placeholder="Title" 
                    name="postTitle" 
                    required 
                    value={postTitle} 
                    onChange={e => setPostTitle(e.target.value)} />
                <textarea 
                    className='createPost__post'
                    name="postBody" 
                    id="" 
                    cols="30" 
                    rows="3" 
                    value={postBody}
                    onChange={e => setPostBody(e.target.value)}
                    placeholder="Post" />
                <input className='createPost__button' type="submit" value="New Post" />
            </form>
        </div>
    )
}
