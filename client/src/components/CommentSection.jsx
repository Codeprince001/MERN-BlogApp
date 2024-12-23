
import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { deleteComment, editComment, fetchComment, updateCommentLikes } from '../redux/features/comments/CommentSlice';
import Comments from './Comments';
import PopupModal from '../util/PopupModal';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user);
  const { comments } = useSelector((state) => state.comment);
  const postcomments = comments[postId]?.comments || [];
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const loadingBarRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCommentData = () => {
    if (!comments[postId]) {
      dispatch(fetchComment(postId));
    }
  };

  useEffect(() => {
    fetchCommentData();
  }, [postId, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    loadingBarRef.current.continuousStart();
    try {
      if (comment.length > 200) {
        return;
      }
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
      });
      const data = await res.json();
      console.log("Data: ", data);
      if (res.ok) {
        // setComment("");
        setCommentError(null);
        loadingBarRef.current.complete();
        dispatch(fetchComment(postId)); // Re-fetch all comments for this post
      }
    } catch (error) {
      setCommentError(error);
      loadingBarRef.current.complete();
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        return navigate("/signin");
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT"
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(updateCommentLikes({ commentId, likes: data.likes, numberOfLikes: data.numberOfLikes, postId })); // Pass the postId to identify the correct group of comments
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    console.log("Handle Edit Comment", comment);
    dispatch(editComment({
      postId,
      commentId: comment._id,
      content: editedContent
    }));
  };

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        dispatch(deleteComment({ postId, commentId })); // Optimistic update
        setShowModal(false);
        setCommentToDelete(null);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-3 w-full'>
      <LoadingBar color="#4F46E5" ref={loadingBarRef} height={3} />

      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as: </p>
          <img className="h-5 w-5 object-cover rounded-full" src={currentUser.profilePicture} alt='' />
          <Link className='text-xs text-cyan-600 hover:underline' to={"/dashboard?tab=profile"}>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className='text-sm text-orange-950 my-5 flex gap-1'>
          You must be logged in to Comment
          <Link className='text-blue-500 hover:underline' to={"/signin"}>Sign in</Link>
        </div>
      )}

      {
        currentUser && (
          <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='add comment' rows={3} maxLength={200} />
            <div className='flex justify-between items-center mt-5'>
              <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
              <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
            </div>
            {
              commentError &&
              <Alert color="failure" className="mt-5">{commentError}</Alert>
            }
          </form>
        )
      }
      {
        postcomments.length === 0 ? (
          <p className='text-sm my-5'>No comments yet</p>
        ) : (
          <>
            <div className='text-sm my-5 flex items-center gap-1'>
              <p>Comments</p>
              <div className='border  border-gray-400 py-1 px-2 rounded-sm'>
                <p>{postcomments.length}</p>
              </div>
            </div>
            {
              postcomments.map(comment => (
                <Comments key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                  commentId={comment._id}
                />
              ))
            }
          </>
        )
      }
      <PopupModal showModal={showModal} onClose={() => setShowModal(false)} onConfirm={() => {
        if (commentToDelete) {
          handleDelete(commentToDelete);
        }
      }} title="Are you sure you want to delete comment" />

    </div>
  );
};

export default CommentSection;