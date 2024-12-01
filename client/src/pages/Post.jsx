import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPost } from '../redux/features/posts/postSlice';


function Post() {
  const { postSlug } = useParams();
  const { loading, error, posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!posts || !posts[postSlug]) {
      console.log("Post", posts, "postslug",);
      dispatch(fetchPost(postSlug));
    }
  }, [postSlug, dispatch, posts]);

  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  );
  return (
    <div>
      post page
    </div>
  );
}

export default Post;