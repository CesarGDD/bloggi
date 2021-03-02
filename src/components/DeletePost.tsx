import { API, graphqlOperation } from 'aws-amplify';
import './DeletePost.css';
import {deletePost, DeletePostInput } from '../graphql';

interface Props {
    postId: string | undefined
}

export const DeletePost = ({postId}: Props) => {

    const deleteHandler = async (postId: string | undefined) => {
        const input: DeletePostInput = {
            id: postId
        }
        await API.graphql(graphqlOperation(deletePost, {input}));
    }

    return (
        <div className="post__deleteButtonContainer" >
            <button className="post__deleteButton" onClick={() => deleteHandler(postId)} >Delete</button>
        </div>
    )
}
