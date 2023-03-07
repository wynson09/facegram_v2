import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';


const UserProfile = ({ USER }) => {

  const [confirmLogout, setConfirmLogout] = useState(false)
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  const [randomImage, setRandomImage] = useState(null);
  const sourceImage = 'https://api.unsplash.com/photos/random?client_id=0Nmt1zwMrVKDaRnc-4jf-lQ_uO0zSUhvNRpOq5MzSFk';

  const activeBtnStyles = 'bg-[#33ccff] text-white font-bold p-2 rounded-full w-20 outline-none'
  const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'
  
  const handleSignOut = () => {
    setConfirmLogout(true);
  }

  useEffect(() => {
    if(text === 'Created'){
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
        .then((data)=>{
          setPins(data);
        })
    }else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
        .then((data)=>{
          setPins(data);
        })
    }
  }, [text, userId])
  
  
  useEffect(() => {
    fetch(sourceImage)
    .then((data)=> {
      return data.json();
    })
    .then((jsonData)=>{
      setRandomImage(jsonData.urls.regular)
    })
  },[])
  
  
  useEffect(() => {
    if(localStorage.userStatus === 'true'){
      const query = userQuery(userId);
      client.fetch(query)
        .then((data) => {
          setUser(data[0]);
        })
    }else {
      navigate('/login');
    }
    
  }, [userId, navigate])
  

  if(!user){
    return <Spinner message='Loading profile...'/>
  }
   
  return (
    <>
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
              src={randomImage}
              alt='banner-pic'
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img 
              src={user.image}
              alt='user-pic'
              className='rounded-full w-[110px] h-[110px] -mt-[50px] shadow-xl object-cover border-[#33ccff] border-2 p-1'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-[10px] z-1 right-[10px]'>
              {userId === USER._id && (
                <button
                  onClick={() => handleSignOut()}
                  className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                >
                  <AiOutlineLogout color='#33ccff' fontSize={21}/>
                </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${activeeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${activeeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          <div className='px-2'>
            {pins?.length ? (
               <MasonryLayout pins={pins} />
            ) : (
              <div className='flex justify-center items-center font-bold w-full text-xl mt-2'>
                No Saved Found!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {confirmLogout && (
      <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
      <div className='flex justify-center items-center'>
        <div className='relative bg-white w-[300px] h-[150px] rounded-2xl flex flex-col items-center justify-center'>
              <h2 className='text-center font-semibold text-[18px] mb-[10px]'>Do you want to logout?</h2>
              <div className='w-[150px] flex justify-between '>
                <button
                  type='button'
                  onClick={()=> {
                    localStorage.userStatus = false;
                    navigate('/login') ;
                    setUser({});
                  }}
                  className='px-[15px] py-[5px] border-[#33ccff] border-2 rounded-full hover:bg-[#33ccff] hover:text-white'
                >
                  Yes
                  </button>
                <button
                  type='button'
                  onClick={()=> setConfirmLogout(false)}
                  className='px-[17px] py-[5px] border-[#33ccff] border-2 rounded-full hover:bg-[#33ccff] hover:text-white'
                >
                  No
                  </button>
              </div>
        </div>
      </div>
    </div>
    )}
    
    </>
  )
}

export default UserProfile