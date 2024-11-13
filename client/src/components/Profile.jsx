import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profileSchema } from "../schemas/UserSchema";
import { signInSuccess, updateStart, updateFailure, updateSuccess } from "../redux/features/users/userSlice";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.profilePicture);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(currentUser || {
    username: "",
    email: "",
    profilePicture: ""
  });
  const filePickerRef = useRef();

  const handleSubmit = async (e) => {
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
    // setErrors({});

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


    try {
      // dispatch(updateStart());
      const response = await fetch("api/user/update-profile", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      console.log("data", data);
      dispatch(updateSuccess(data.user));

      if (!response.ok) {  // if status code is not 2xx, handle it as an error
        dispatch(signInFailure(data.message || "Failed to upload Image"));
        return;
      }
    } catch (error) {

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

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
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
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div >
  );
};

export default Profile;