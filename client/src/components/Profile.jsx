import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(null);
  const filePickerRef = useRef();

  useEffect(() => {
    if (imgFile) {
      uploadImage();
    }
  }, [imgFile]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgFileUrl(URL.createObjectURL(file));
    }
  };




  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input hidden type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          <img src={imgFileUrl || currentUser.profilePicture} alt="user" className="object-cover rounded-full w-full h-full border-8 border-[lightgray]" />
        </div>

        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;