import { API, Auth, graphqlOperation } from 'aws-amplify';
import { FormEvent, useEffect, useState } from 'react';
import './CreateCommentPost.css';
import { createComment, CreateCommentInput, Post } from '../graphql';

interface Props {
    postInfo: Post
}

export const CreateCommentPost = ({postInfo}: Props) => {
    const [commentOwnerId, setCommentOwnerId] = useState<string|undefined>();
    const [commentOwnerUsername, setCommentOwnerUsername]= useState<string|undefined>();
    const [content, setContent] = useState<string>('');


    useEffect(()=> {
        const postInfo = async () => {
            await Auth.currentUserInfo().then(user => {
                setCommentOwnerId(user.attributes.sub)
                setCommentOwnerUsername(user.username)
            })
        }
        postInfo()
    },[]);

    const addCommentHandle = async (e:FormEvent) => {
        e.preventDefault();
        const input: CreateCommentInput = {
            commentPostId: postInfo.id,
            commentOwnerId: commentOwnerId,
            commentOwnerUsername: commentOwnerUsername,
            content: content,
            createdAt: new Date().toISOString()
        }
        await API.graphql(graphqlOperation(createComment, {input})) as CreateCommentInput;
        setContent('');
    }

    return (
        <div className="post__CreateCommentContainer" >
            <form className="post__CreateCommentForm" action="" onSubmit={addCommentHandle} >
                <textarea 
                    name="content" 
                    cols="30" 
                    rows="1" 
                    required
                    value={content}
                    onChange={e => setContent(e.target.value)} />

                <input type="submit" value='Comment'/>
            </form>
            
        </div>
    )
}
