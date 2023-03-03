import React, { useEffect, useRef, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile} from '../components';
import { client } from '../client';
import logo from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [ user, setUser] = useState(null);
  const userInfo = fetchUser();
  const scrollRef = useRef(null);
  const query = userQuery(userInfo?.sub);
  
  useEffect(()=> {
    client.fetch(query)
      .then((data)=>{
        setUser(data[0]);
      })
    },[query]);

  useEffect(()=> {
    scrollRef.current.scrollTo(0, 0)
  },[]);

  return (
    <div className='flex bg-gray-50 flex-col h-screen transition-height duration-75 ease-out md:flex-row'>
      <div className='hidden h-screen flex-initial md:flex'>
        <Sidebar user={user && user} />
      </div>
      <div className='flex flex-row md:hidden'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="user-profile" className='w-[60px] rounded-md border-2 border-blue-400 p-[2px]' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile USER={user && user} />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home