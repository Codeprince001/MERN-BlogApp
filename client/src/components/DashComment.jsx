import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import PopupModal from '../util/PopupModal';
import LoadingBar from 'react-top-loading-bar';
import { FaCheck, FaTimes } from 'react-icons/fa';


const DashComment = () => {
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  console.log(comments);
  const loadingBarRef = useRef(null);


  useEffect(() => {

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.commets.length < 9) {
            setShowmore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowmore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComments = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comments/deleteComment/${commentToDelete}`, {
        method: "DELETE"
      });
      loadingBarRef.current.continuousStart();

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      setComments((prev) => prev.filter((comments) => comments._id !== commentToDelete));
      loadingBarRef.current.complete();
    } catch (error) {
      console.log(error);
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className='table-auto overflow-x-scroll overflow-y-hidden md:mx-auto p-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <LoadingBar color="#4F46E5" ref={loadingBarRef} height={4} />
      {currentUser.isAdmin && comments?.length > 0 ?
        <div>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostID</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            {comments.map((comment) => {
              return (
                <Table.Body key={comment._id} className='divide-y' >
                  <Table.Row className='bg-whte dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.NumberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell><span className='font-medium text-red-600 hover:underline cursor-pointer' onClick={() => { setShowModal(true); setCommentToDelete(comment._id); }}>Delete</span></Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showmore && <button onClick={handleShowMore} className="w-full text-teal-500 items-center text-center text-sm py-7 mx-auto">Show more</button>}
        </div>
        : (
          <div className='flex justify-center items-center mx-auto my-auto'>
            <p className='text-4xl'>No comment Yet!</p>
          </div>
        )}
      <PopupModal showModal={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeleteComments} title="Are you sure you want to delete comment" />
    </div>
  );
};

export default DashComment;