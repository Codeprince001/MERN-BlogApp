import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profileSchema } from "../schemas/UserSchema";
import { signoutSuccess, updateStart, updateFailure, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/features/users/userSlice";


import { Link } from "react-router-dom";
import PopupModal from "../util/PopupModal";


const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);


  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.profilePicture);
  const [errors, setErrors] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();

  const handleSubmit = async (e) => {
    setUpdateUserSuccess();
    setUpdateUserError(null);
    e.preventDefault();


    // Validate form data using Zod
    const Data = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value
    };

    const result = profileSchema.safeParse(Data);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors); // Set errors to display
      return;
    }


    // Reset errors if form is valid
    setErrors({});

    const formData = new FormData();
    formData.append("username", e.target.username.value);
    formData.append("email", e.target.email.value);
    formData.append("userId", currentUser._id);

    // Only add the password if the user provided it
    if (e.target.password.value) {
      formData.append("password", e.target.password.value);
    }

    if (imgFile) {
      formData.append("image", imgFile);
    }

    // Check if there are actual changes
    const isUsernameUnchanged = Data.username === currentUser.username;
    const isEmailUnchanged = Data.email === currentUser.email;
    const isPasswordEmpty = !Data.password;
    const isImageUnchanged = !imgFile;

    if (isUsernameUnchanged && isEmailUnchanged && isPasswordEmpty && isImageUnchanged) {
      setUpdateUserError("No changes to update");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`api/user/update-profile/${currentUser._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {  // if status code is not 200, handle it as an error
        dispatch(updateFailureFailure(data.message || "Failed to upload Image"));
        return;
      } else {
        dispatch(updateSuccess(data.user));
        setUpdateUserSuccess("User's Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImgFile(file);
      setImgFileUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure());
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout/", {
        method: "POST"
      });

      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>


      {/* Form */}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input hidden type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {/* {imageFile} */}
          <img src={imgFileUrl || currentUser.profilePicture} alt="user" className="object-cover rounded-full w-full h-full border-8 border-[lightgray]" />
        </div>

        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        <TextInput type="email" readOnly id="email" placeholder="email" defaultValue={currentUser.email} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <TextInput type="password" id="password" placeholder="password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading}>
          {loading ? "loading..." : "Update"}
        </Button>
        {
          currentUser.isAdmin && (
            <Link to={"/create-post"}><Button type="button" gradientDuoTone="cyanToBlue" className="w-full">Create post</Button></Link>
          )
        }
      </form>


      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>Delete Account</span>
        <span className="cursor-pointer" onClick={handleSignout}>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color="success" className="mt-5">{updateUserSuccess}</Alert>}
      {error && <Alert color="failure" className="mt-5">{error}</Alert>}


      <PopupModal showModal={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeleteUser} title="Are you sure you want to delete your account" />

    </div >
  );
};

export default Profile;