import React, { useState, useEffect } from 'react';
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import { Button } from "@material-ui/core";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";



function Posts({ postId, user, userName, caption, imageURL }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [editComment, setEditComment] = useState('');
    const [commentID, setCommentID] = useState('');
    const [show, setShow] = useState(false)

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map
                        ((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                        }))
                    );
                });
        }
        return () => {
            unsubscribe();
        };

    }, [postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: newComment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setNewComment('');
    }

    const handleEdit = (id, txt) => {
        setShow(true)
        setEditComment(txt)
        setCommentID(id)

    }

    const updateComment = () => {
        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .doc(commentID).update({
                text: editComment
            })
        setShow(false)

    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={userName}
                    src=" "
                />
                <h3>{userName}</h3>
            </div>

            <img
                className="post__image"
                src={imageURL}
            />

            <p className="post__text">
                <b>{userName}</b> {caption}
            </p>

            <div className="post__comments">
                {comments.map(({ id, comment }) => (
                    <>
                        <p key={id}>
                            <b>{comment.username}</b>: &nbsp;{comment.text}
                        </p>

                    </>
                ))}

                &nbsp;
                {comments.map(({ id, comment }) => (
                    (comment.username === user.displayName || user.displayName === userName) &&
                    <p key={id}>
                        <EditIcon style={{ color: 'blue' }} onClick={() => { handleEdit(id, comment.text) }} />
                        <DeleteOutlineIcon style={{ color: 'red' }} onClick={() => {
                            db.collection("posts")
                                .doc(postId)
                                .collection("comments")
                                .doc(id).delete()
                        }} />

                    </p>

                ))}


            </div>
            {user && show && <>
                <form className="post__commentbox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Edit comment..."
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                    />
                    <Button
                        className="post__button"
                        disabled={!editComment}
                        type="submit"
                        onClick={updateComment}
                    >
                        update
                    </Button>
                </form>
            </>}
            {user && (
                <form className="post__commentbox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        className="post__button"
                        disabled={!newComment}
                        type="submit"
                        onClick={postComment}
                    >
                        POST
                    </Button>
                    {
                        user.displayName === userName &&

                        <DeleteForeverIcon style={{ color: ' red' }} onClick={() => {
                            db
                                .collection("posts")
                                .doc(postId).delete()
                        }} />
                    }

                </form>
            )}

        </div>

    );
}

export default Posts;
