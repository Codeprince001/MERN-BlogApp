import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPost } from '../redux/features/posts/postSlice';
import CallToAction from '../components/CallToAction';


function Post() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const post = posts[postSlug];



  const fetchPostData = () => {
    if (!post) {
      dispatch(fetchPost(postSlug));
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postSlug, dispatch]);

  useEffect(() => {
    if (post) {
      setLoading(false);
    }
  }, [post]);


  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xs' />
    </div>
  );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto'>
        {post.title}
      </div>
      <Link className='self-center mt-5' to={`/search?category=${posts[postSlug]?.category}`}><Button color='gray' pill size='xs'>{posts && posts[postSlug]?.category}</Button></Link>
      <img src={post && post.image} alt={post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover md:max-w-[500px] mx-auto' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs italic'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{(post?.content?.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post && post?.content }} className='post-content p-3 mx-auto w-full max-w-2xl'>

      </div>

      <div className='max-w-4xl mx-auto'>
        <CallToAction />
      </div>
    </main>
  );
}

export default Post;