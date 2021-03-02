import React, { useState, useEffect } from 'react';
import './DisplayPosts.css'
import {API, Auth} from 'aws-amplify';
import { 
     listPosts,
     onCreateComment,
     OnCreateCommentSubscription,
     onCreateLike,
     OnCreateLikeSubscription,
     onCreatePost, 
     OnCreatePostSubscription, 
     onDeleteLike, 
     OnDeleteLikeSubscription, 
     onDeletePost, 
     OnDeletePostSubscription, 
     onUpdatePost, 
     OnUpdatePostSubscription, 
     Post,
    } from '../graphql';
import { DeletePost } from './DeletePost';
import { EditPost } from './EditPost';
import { CreateCommentPost } from './CreateCommentPost';
import { CommentPost } from './CommentPost';
import { Like } from './Like';

interface Props {
    
}

export const DisplayPosts = (props: Props) => {
    const [posts, setPosts] = useState<Post[]>();
    const [ownerId, setOwnerId] = useState<string>();
    const [updatePosts, setUpdatePosts]= useState<OnCreatePostSubscription | OnDeletePostSubscription>();


    const getPosts = async () => {
        const result: any = await API.graphql({query: listPosts})
        setPosts(result?.data?.listPosts?.items)
    }
    const getUser = async () => {
        await Auth.currentUserInfo().then(user => {
               setOwnerId(user.attributes.sub);
           })
       }

    useEffect(() => {
        
        getUser();
        getPosts();
    },[updatePosts]);

    const updateCreatePost = () => {
        API.graphql({
            query: onCreatePost
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onCreatePost)
            }
        }) as OnCreatePostSubscription
    }

    const subscribeDeletePost = () => {
        API.graphql({
            query: onDeletePost
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onDeletePost)
            }
        }) as OnDeletePostSubscription
    }
    const subscribeUpdatePost = () => {
        API.graphql({
            query: onUpdatePost
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onUpdatePost)
            }
        }) as OnUpdatePostSubscription
    }

    const subscribecommentPost = () => {
        API.graphql({
            query: onCreateComment
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onCreateComment)
            }
        }) as OnCreateCommentSubscription
    }
    const subscribelikePost = () => {
        API.graphql({
            query: onCreateLike
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onCreateLike)
            }
        }) as OnCreateLikeSubscription
    }
    const subscribeDeleteLike = () => {
        API.graphql({
            query: onDeleteLike
            // @ts-ignore
        }).subscribe({next: postData => {
                setUpdatePosts(postData.value.data.onDeleteLike)
            }
        }) as OnDeleteLikeSubscription
    }

    useEffect(()=> {
        updateCreatePost();
        subscribeDeletePost();
        subscribeUpdatePost();
        subscribecommentPost();
        subscribelikePost();
        subscribeDeleteLike();
    },[])

    return (
        <div className='post__container' >
            {!posts? "Loading..." : null}
            {posts?.map((post: Post) => {
                return (
                    <div className='post__card' key={post.id} >
                        <h2 className="post__title" > {post.postTitle} </h2>
                        <div className='post__body' > 
                           <h4>{post.postBody} </h4>  
                            <p className='post__date' >Made for
                                <strong>
                                    {` ${post.postOwnerUsername}`} 
                                </strong> on 
                                <em>
                                    {` ${new Date(post.createdAt).toDateString()}`} 
                                </em>
                            </p>
                        </div>
                        <div className="post__like" >
                            <Like postInfo={post} />
                        </div>
                        <div className="post__buttons">
                            {ownerId === post.postOwnerId &&
                                <EditPost postInfo={post} />
                            }
                            {ownerId === post.postOwnerId &&
                                <DeletePost postId={post.id} />
                            }
                        </div>
                        <div className="post__addComment" >
                            <CreateCommentPost postInfo={post} />
                        </div>
                        <div className="post__comment">
                            {post.comments?.items?.map((comment => <CommentPost key={comment?.id} commentData={comment}/>))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
