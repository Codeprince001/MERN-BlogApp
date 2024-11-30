import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';


function Post() {
  const { postSlug } = useParams();
  const { loading, error, posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  console.log(posts);

  useEffect(() => {
    if (!posts[postSlug]) {
      dispatch(fetchpost(postSlug));
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
