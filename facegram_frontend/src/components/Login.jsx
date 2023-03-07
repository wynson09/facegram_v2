import React, { useEffect } from 'react'
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { client } from '../client';



const Login = () => {

  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);

    localStorage.setItem('user', JSON.stringify(userObject));

    const { name, sub, picture } = userObject;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    }
    client.createIfNotExists(doc)
      .then(() =>{
        localStorage.userStatus = true;
        navigate('/', {replace: true})
        
      })
  }

  useEffect(()=>{
    google.accounts.id.initialize({
      client_id: "215016606046-2jud92lu90dgmstvhg9vdjkcaf52461k.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: "outline", size: "large"}
    );
  },[])

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video 
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'> 
          <div className='p-5'>
            <img src={logo} alt="logo" width="200px"/>
          </div>
          <div className='shadow-2xl'>
            <div id="signInDiv"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login