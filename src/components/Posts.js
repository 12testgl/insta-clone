import React, { useState, useEffect } from 'react';
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import { Button } from "@material-ui/core";

import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";



function Posts({ postId, user, userName, caption, imageURL }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
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
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b>:{comment.text}
                    </p>
                ))}
            </div>
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

                </form>
            )}

        </div>

    );
}

export default Posts;
