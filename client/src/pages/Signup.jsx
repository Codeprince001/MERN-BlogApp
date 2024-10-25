import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl gap-5 mx-auto flex-col md:flex-row md:items-center'>
        {/* left */}
        <div className='md:max-w-[50%]'>
          <Link to="/" className='self-center font-bold sm:text-xl dark:text-white text-4xl'>
            <span className='mr-1 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-700 rounded-lg text-white'>Wisdom's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            Welcome to Wisdom's Blog, where curiosity meets clarity. Here, we dive deep into technology, explore creative projects, and share insights that empower you to stay ahead.
          </p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Username' />
              <TextInput type='text' placeholder='username' id='username' />
            </div>
            <div>
              <Label value='Email' />
              <TextInput type='text' placeholder='johndoe@email.com' id='email' />
            </div>
            <div>
              <Label value='Password' />
              <TextInput type='text' placeholder='password' id='password' />
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5 justify-center'>
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;