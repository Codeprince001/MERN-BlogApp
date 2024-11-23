import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";


const DashPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser, error, loading } = useSelector((state) => state.user);

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          console.log(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
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
                    <Table.Cell><span className='font-medium text-red-600 hover:underline cursor-pointer'>Delete</span></Table.Cell>
                    <Table.Cell><Link to={`/update-post/${post._id}`} ><span className='text-teal-500 hover:underline cursor-pointer'>edit</span></Link></Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}


          </Table>
        </div>
        : (
          <p>No Post Yet!</p>
        )}
    </div>
  );
};

export default DashPosts;