import { API, Auth, graphqlOperation } from 'aws-amplify';
import './EditPost.css';
import { useEffect, useState } from 'react';
import { Post, updatePost, UpdatePostInput, UpdatePostMutation } from '../graphql';
//@ts-ignore
import Modal from 'react-modal';

interface Props {
    postInfo: Post
}

export const EditPost = ({postInfo}: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [id, setId] = useState<string | undefined >(postInfo.id);
    const [postOwnerId, setPostOwnerId]= useState<string>('');
    const [postOwnerUsername, setPostOwnerUsername]= useState<string>('');
    const [postTitle, setPostTitle] = useState<string | undefined>(postInfo.postTitle);
    const [postBody, setPostBody] = useState<string | undefined>(postInfo.postBody);

    useEffect(()=> {
        const postInfo = async () => {
            await Auth.currentUserInfo().then(user => {
                setPostOwnerId(user.attributes.sub)
                setPostOwnerUsername(user.username)
            })
        }
        postInfo()
    },[]);

    const modalHandle = () => {
        setShowModal(!showModal);
    }

    const updatePostHandler = async (e:any) => {
        e.preventDefault();
        const input: UpdatePostInput = {
            id: id,
            postOwnerId: postOwnerId,
            postOwnerUsername: postOwnerUsername,
            postTitle: postTitle,
            postBody: postBody,
            // createdAt: new Date().toISOString()
        }
        await API.graphql(graphqlOperation(updatePost, {input})) as UpdatePostMutation;
        setShowModal(!showModal);
    }

    const customStyles = {
        overlay : {
            backgroundColor     : 'rgba(73, 88, 103, 0.6)'
        },
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
          backgroundColor       : '#bdd5ea',
          width                 : '60%',
          borderRadius          : '15px'
        }
      };
    
    return (
        <div className="post__editButtonContainer" >
            <button className="post__editButton" onClick={modalHandle} >Edit</button>
            {showModal && (
                    <Modal isOpen={showModal} ariaHideApp={false} style={customStyles} >
                     <div className="modal__container" >
                        <button onClick={modalHandle} className="modal__closeButton" >
                            X
                        </button>
                        <form onSubmit={updatePostHandler} className="modal__form" >
                            <input 
                                className="modal__formTitle"
                                type="text" 
                                placeholder="Title"
                                value={postTitle}
                                onChange={e => setPostTitle(e.target.value)} />
                            <textarea 
                                className="modal__formBody"
                                cols="30" 
                                rows="10" 
                                placeholder="Body"
                                value={postBody}
                                onChange={e => setPostBody(e.target.value)} />
                            <button className="modal__formSubmitButton" >
                                Update Post
                            </button>
                        </form>
                    </div>
                    </Modal>
            )}
        </div>
    )
}
