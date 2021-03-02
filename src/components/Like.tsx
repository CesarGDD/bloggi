import { API, Auth, graphqlOperation } from 'aws-amplify';
import './Like.css'
import React, { useEffect, useState } from 'react';
import { createLike, CreateLikeInput, deleteLike, DeleteLikeInput, Post } from '../graphql';
import { GiChiliPepper } from 'react-icons/gi';
import { UserLikePost } from './UserLikePost';

interface Props {
    postInfo: Post,
}

export const Like = ({postInfo}: Props) => {
    const [ownerId, setOwnerId] = useState<string>();
    const [ownerUsername, setOwnerUsername]= useState<string>();
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [errorLike, setErrorLike] = useState<string>('');
    const [postLikeBy, setPostLikeBy]= useState<string[]>([]);
    const [likeOwnerId, setLikeOwnerId] = useState<string | undefined>();
    const [likeId, setLikeId] = useState<string | undefined>();

    const getLikeIdHelper = async () => {
        if(postInfo) {
            //@ts-ignore
            for (let like of postInfo?.likes?.items) {
                const likeOwnId = like?.likeOwnerId
                    setLikeOwnerId(likeOwnId);
                    setLikeId(like?.id);
            } 
        }
    }
        

    useEffect(() => {
        const getUser = async () => {
            await Auth.currentUserInfo().then(user => {
                   setOwnerId(user.attributes.sub);
                   setOwnerUsername(user.username);
               })
           }
        getUser();
        getLikeIdHelper();
    },[postInfo])

    const deleteHandler = async () => {
                const input: DeleteLikeInput = {
                    id: likeId
                }
                await API.graphql(graphqlOperation(deleteLike, {input}));
                setLikeOwnerId('');
            }
    
 

    const createLikeHandle = async () => {
        if (postInfo.postOwnerId === ownerId) {
            setErrorLike('Can\'t Like Your Own Post');
        }else {
            const input: CreateLikeInput = {
                numberLikes: 1,
                likeOwnerId: ownerId,
                likeOwnerUsername: ownerUsername,
                likePostId: postInfo.id
            }
            
            try {
                 await API.graphql(graphqlOperation(createLike, {input}))
            } catch (error) {
                console.error(error);
                
            }
            setErrorLike('');
        }

    }
    const handleMouseOver = async () => {
        setIsHovering(!isHovering);
        let innerlikes = postLikeBy;
        //@ts-ignore
        for (let post of postInfo?.likes?.items) {
            //@ts-ignore
                innerlikes.push(post.likeOwnerUsername)
                setPostLikeBy(innerlikes)
        }
    }
    const handleMouseOverLeave = async () => {
        setIsHovering(!isHovering)
        setPostLikeBy([]);
    }

    const likeNumbers: number | undefined = postInfo.likes?.items?.length;
    
    return (
        <div>
            <div className={likeNumbers === 0 ? 'post__likeFalse': 'post__likeTrue'} >
                <GiChiliPepper 
                    className="post__likeIcon"
                    onClick={ownerId === likeOwnerId ? deleteHandler : createLikeHandle}
                    onMouseEnter={handleMouseOver} 
                    onMouseLeave={handleMouseOverLeave}/>
                <small className="post__numberLikes" >
                    {likeNumbers === 0 ? null : likeNumbers}
                </small>
            </div>
            <div className="post__likeUser" >
                <UserLikePost userData={postLikeBy} />
            </div>
            <p className="post__likeError" onClick={()=> {setErrorLike('')}} >
                {errorLike}
            </p>
        </div>
    )
}
