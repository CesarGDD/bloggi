import { Comment } from '../graphql';
import './CommentPost.css';

interface Props {
    commentData: Comment | null
}

export const CommentPost = ({commentData}: Props) => {
    return (
        <div className="comment__container" >
            <div className="comment__by" >
                <p>Comment by: <strong> {commentData?.commentOwnerUsername} </strong> </p>
                {/* @ts-ignore */}
                <time> {new Date(commentData.createdAt).toDateString()} </time>
            </div>
            <p> {commentData?.content} </p>
        </div>
    )
}
