import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPost } from '../redux/features/posts/postSlice';


function Post() {
  const { postSlug } = useParams();
  const { loading, error, posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  console.log(posts);

  useEffect(() => {
    if (!posts || !posts[postSlug]) {
      console.log("Post", posts, "postslug",);
      dispatch(fetchPost(postSlug));
    }
  }, [postSlug, dispatch, posts]);

  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xs' />
    </div>
  );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto'>
        {posts[postSlug]?.title}
      </div>
      <Link className='self-center mt-5' to={`/search?category=${posts[postSlug]?.category}`}><Button color='gray' pill size='xs'>{posts && posts[postSlug]?.category}</Button></Link>
      <img src={posts && posts[postSlug]?.image} alt={posts[postSlug]?.title} className='mt-10 p-3 max-h-[600px] w-full object-cover md:max-w-[500px] mx-auto' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs italic'>
        <span>{posts && new Date(posts[postSlug]?.createdAt).toLocaleDateString()}</span>
        <span>{(posts[postSlug]?.content?.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: posts && posts[postSlug]?.content }} className='post-content p-3 mx-auto w-full max-w-2xl'>

      </div>
    </main>
  );
}

export default Post;