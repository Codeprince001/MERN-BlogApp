import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import PopupModal from '../util/PopupModal';
import LoadingBar from 'react-top-loading-bar';
import { FaCheck, FaTimes } from 'react-icons/fa';




const DashUsers = () => {
  const [users, setUsers] = useState([]);
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const loadingBarRef = useRef(null);


  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUsers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowmore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowmore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userToDelete}`, {
        method: "DELETE"
      });
      loadingBarRef.current.continuousStart();

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      setUsers((prev) => prev.filter((user) => user._id !== userToDelete));
      loadingBarRef.current.complete();
    } catch (error) {
      console.log(error);
      loadingBarRef.current.complete();

    }
  };

  return (
    <div className='table-auto overflow-x-scroll overflow-y-hidden md:mx-auto p-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <LoadingBar color="#4F46E5" ref={loadingBarRef} height={4} />
      {currentUser.isAdmin && users.length > 0 ?
        <div>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            {users.map((user) => {
              return (
                <Table.Body key={user._id} className='divide-y' >
                  <Table.Row className='bg-whte dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell><Link to={`/user/${user.username}`}><img src={user?.profilePicture} alt={user.username} className='w-10 h-10 object-fill rounded-full ' /></Link></Table.Cell>
                    <Table.Cell><Link to={`/user/${user.name}`} className='font-medium text-gray-700 dark:text-white'>{user.username}</Link></Table.Cell>
                    <Table.Cell><Link to={"#"} className='font-medium text-gray-700 dark:text-white'>{user?.isAdmin ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}</Link></Table.Cell>
                    <Table.Cell><span className='font-medium text-red-600 hover:underline cursor-pointer' onClick={() => { setShowModal(true); setUserToDelete(user._id); }}>Delete</span></Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showmore && <button onClick={handleShowMore} className="w-full text-teal-500 items-center text-center text-sm py-7 mx-auto">Show more</button>}
        </div>
        : (
          <div className='flex justify-center items-center mx-auto my-auto'>
            <p className='text-4xl'>No user Yet!</p>
          </div>
        )}
      <PopupModal showModal={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeleteUser} title="Are you sure you want to delete user" />
    </div>
  );
};

export default DashUsers;