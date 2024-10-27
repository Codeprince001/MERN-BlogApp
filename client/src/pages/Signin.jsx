import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { signInFailure, signInStart, signInSuccess } from '../redux/features/users/userSlice';
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {  // if status code is not 2xx, handle it as an error
        dispatch(signInFailure(data.message || "An error occurred"));
        return;
      }


      if (res.ok) {
        navigate("/");
      }
      dispatch(signInSuccess(data));
    }

    catch (error) {
      dispatch(signInFailure(error.message));
    }
  };


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
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' />
              <TextInput type='email' placeholder='johndoe@email.com' id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value='Password' />
              <div className='relative'>
                <TextInput type={showPassword ? "text" : "password"} placeholder='********' id='password' onChange={handleChange} />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'
                >
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </button>
              </div>
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : "Sign Up"
              }
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5 justify-center'>
            <span>Don't Have an account?</span>
            <Link to="/sign-up" className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>

      </div>
    </div>
  );
};

export default Signin;