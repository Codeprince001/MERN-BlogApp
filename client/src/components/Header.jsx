import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from '../redux/features/theme/themeSlice';
import { signoutSuccess } from '../redux/features/users/userSlice';


const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);





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
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='mr-1 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-700 rounded-lg text-white'>Wisdom's</span>
        Blog
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={IoSearchOutline}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill >
        <IoSearchOutline />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {
            theme === "light" ? <FaSun /> : <FaMoon />
          }
        </Button>
        {currentUser ? (
          <Dropdown className='p-1' arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded className='border-2 rounded-full' />}>
            <Dropdown.Header>
              <span className='block text-sm '>{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Signout</Dropdown.Item>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" >
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>

        <Navbar.Link href='/' active={path === "/"} >
          Home
        </Navbar.Link>

        <Navbar.Link href="/about" active={path === "/about"} >
          About
        </Navbar.Link>

        <Navbar.Link href="/projects" active={path === "/projects"} >
          Projects
        </Navbar.Link>

      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;