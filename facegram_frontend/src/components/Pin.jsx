import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { urlFor, client } from '../client';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';
const Pin = ({pin: { postedBy, image, _id, destination, save}}) => {

    const [postHovered, setPostHovered] = useState(false); 
    const [userSaveLength, setUserSaveLength] = useState(save?.length);
    const navigate = useNavigate();
    const user = fetchUser();
    const [pinSave, setPinSave] = useState(!!(save?.filter((item)=> item?.postedBy?._id === user?.sub))?.length);
    

    const savePin = (id) => {
        if(!pinSave){

            client
                .patch(id)
                .setIfMissing({ save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub
                    }
                }])
                .commit()
                .then(async (data) =>{
                    data.save.forEach((savePin) =>{     
                    if(savePin.userId === user?.sub){
                        setPinSave(true);
                        setUserSaveLength(data.save.length);
                      }
                    })
                    
                   
                })
        }
    }

  return (
    <div className='m-2'>
        <div 
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick = {() => navigate(`/pin-detail/${_id}`)}
            className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
        >
            <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full'/>
            {postHovered && (
                <div
                    className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                    style={{height:'100%'}}
                >
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                            <a 
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e )=> e.stopPropagation()}
                                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div>
                        {pinSave? (
                            <button 
                                type='button' 
                                className='bg-[#33ccff] opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                            >
                               {userSaveLength} Saved
                            </button>
                        ): (
                            <button 
                                onClick={(e)=> {
                                    e.stopPropagation();
                                    savePin(_id);
                                }}
                                type='button' 
                                className='bg-[#33ccff] opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                Save
                            </button>
                        )}
                    </div>
                    <div className='flex justify-between items-center gap-2 w-full'>
                        {destination && (
                            <a
                                href={destination}
                                onClick={(e)=> {
                                    e.stopPropagation();
                                }}
                                target='_blank'
                                rel='noreferrer'
                                className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                            >
                                <BsArrowUpRightCircleFill />
                                {destination.length > 15 ? `${destination.slice(8, 15)}...` : destination}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
        <Link 
            to={`/user-profile/${postedBy?._id}`}
            className='flex gap-2 mt-2 items-center'
        >
            <img 
                src={postedBy?.image}
                alt="user-profile" 
                className='w-8 h-8 rounded-full object-cover'
            />
            <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin