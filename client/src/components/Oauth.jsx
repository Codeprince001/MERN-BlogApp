import { Button } from 'flowbite-react';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { signInFailure, signInSuccess } from '../redux/features/users/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Oauth = () => {
  const auth = getAuth(app);
  console.log(auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const handleGoogleClick = async () => {

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });


    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL
        })
      });

      const data = await res.json();
      if (!res.ok) {  // if status code is not 2xx, handle it as an error
        dispatch(signInFailure(data.message || "An error occurred"));
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };


  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
      <FaGoogle className='text-lg mr-2' />
      Continue with Google
    </Button>
  );
};

export default Oauth;