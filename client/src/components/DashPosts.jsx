import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import PopupModal from '../util/PopupModal';
import LoadingBar from 'react-top-loading-bar';
import { setPosts } from '../redux/features/posts/postSlice';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import { Button, Spinner } from 'flowbite-react';




const DashPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);


  const dispatch = useDispatch();


  const loadingBarRef = useRef(null);


  useEffect(() => {

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          dispatch(setPosts(data.posts)); // Dispatch action to update Redux state
          setLoading(false);
          console.log(data.posts);
          if (data.posts.length < 9) {
            setShowmore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowmore(false);
        }
      }
    } catch (error) {

    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postToDelete}/${currentUser._id}`, {
        method: "DELETE"
      });
      loadingBarRef.current.continuousStart();

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      setUserPosts((prev) => prev.filter((post) => post._id !== postToDelete));
      loadingBarRef.current.complete();

    } catch (error) {
      console.log(error);
      loadingBarRef.current.complete();

    }
  };

  return (
    <div className='table-auto overflow-x-scroll overflow-y-hidden md:mx-auto p-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <LoadingBar color="#4F46E5" ref={loadingBarRef} height={4} />
      {currentUser.isAdmin && userPosts.length > 0 ?
        <div>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>

            {userPosts.map((post) => {
              return (
                <Table.Body>
                  <Table.Row key={post._id} className='bg-whte dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell><Link to={`/post/${post.slug}`}><img src={post?.image} alt={post.title} className='w-20 h-10 object-fill ' /></Link></Table.Cell>
                    <Table.Cell><Link to={`/post/${post.slug}`} className='font-medium text-gray-700 dark:text-white'>{post.title}</Link></Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell><span className='font-medium text-red-600 hover:underline cursor-pointer' onClick={() => { setShowModal(true); setPostToDelete(post._id); }}>Delete</span></Table.Cell>
                    <Table.Cell><Link to={`/update-post/${post._id}`} ><span className='text-teal-500 hover:underline cursor-pointer'>edit</span></Link></Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showmore && <button onClick={handleShowMore} className="w-full text-teal-500 items-center text-center text-sm py-7 mx-auto">Show more</button>}
        </div>
        : (loading &&
          <div className='flex flex-col justify-center items-center min-h-screen'>
            <Spinner size='lg' />
            <div>Fetching Posts</div>
          </div>
        )}
      <PopupModal showModal={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeletePost} title="Are you sure you want to delete post" />
    </div>
  );
};

export default DashPosts;