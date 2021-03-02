import React from 'react'
import './UserLikePost.css';

interface Props {
    userData: string[]
}

export const UserLikePost = ({userData}: Props) => {
    
    return (
        <div>
            {userData.map((user: string) =>{
                return(
                    <div className="post__likedBy" key={user} >
                        <span> {` Liked By: ${user} `} </span>
                    </div>
                )
            })}
        </div>
    )
}
