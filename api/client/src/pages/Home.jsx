import React, { useEffect, useState } from 'react';
import CallToAction from "../components/CallToAction";
import { Link } from 'react-router-dom';
import PostCard from "../components/PostCard";
import CategoryCard from '../components/CategoriesCard';
import { categories } from '../assets/images/constants';
import clipart from "../assets/images/rb_3863.png";
import { Button } from 'flowbite-react';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className='flex flex-col md:flex-row items-center gap-6 p-10 px-3 max-w-6xl mx-auto'>
        {/* Text Section */}
        <div className='lg:w-1/2 space-y-4 md:w-1/2'>
          <h1 className='text-3xl font-bold md:text-4xl lg:text-6xl'>Welcome to my Blog</h1>
          <p className='text-gray-500 text-xs sm:text-sm md:w-3/4'>
            Here you'll find a variety of articles and tutorials on topics such as
            web development, software engineering, and programming languages.
          </p>
          <Link
            to='/search'
            className='text-xs sm:text-sm text-teal-500 font-bold'
          >
            <Button className='mt-2'>
              View all posts
            </Button>
          </Link>
        </div>

        {/* Illustration Section */}
        <div className='lg:w-1/2 md:flex-1 flex justify-center'>
          <img
            src={clipart}
            alt="Welcome Illustration"
            className="w-80 md:w-96 lg:w-full"
          />
        </div>
      </div>


      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-semibold text-center mb-6">Categories</h2>
        <div className="flex justify-center gap-6 flex-col m-4 flex-1 sm:flex-row items-center">
          {categories.map((category) => (
            <CategoryCard key={category.title} icon={category.icon} title={category.title} />
          ))}
        </div>
      </div>


      <div className='p-4 m-3 bg-amber-100 dark:bg-slate-700  rounded-tl-3xl rounded-br-3xl w-5xl'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;