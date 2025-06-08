import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaChartPie, FaRegEdit, FaUser } from "react-icons/fa";
import { IoChatbox, IoDocumentText, IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/features/users/userSlice";
import { HiOutlineUser } from "react-icons/hi";



const DashSidebar = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);


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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="cursor-pointer flex flex-col gap-2">
          <Sidebar.Item onClick={() => navigate("/dashboard?tab=profile")} active={tab === "profile"} icon={FaUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark">
            Profile
          </Sidebar.Item>
          {currentUser.isAdmin && (
            <>
              <Sidebar.Item onClick={() => navigate("/dashboard?tab=dashboard-info")} active={tab === "dashboard-info"} icon={FaChartPie} >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item onClick={() => navigate("/dashboard?tab=posts")} active={tab === "posts"} icon={IoDocumentText} >
                Posts
              </Sidebar.Item>
              <Sidebar.Item onClick={() => navigate("/create-post")} icon={FaRegEdit} >
                Create post
              </Sidebar.Item>
              <Sidebar.Item onClick={() => navigate("/dashboard?tab=users")} icon={HiOutlineUser} >
                Users
              </Sidebar.Item>
              <Sidebar.Item onClick={() => navigate("/dashboard?tab=comments")} icon={IoChatbox} >
                Comments
              </Sidebar.Item>
            </>
          )}

          <Sidebar.Item icon={IoLogOutOutline} className="cursor-pointer" onClick={handleSignout}>
            Signout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;