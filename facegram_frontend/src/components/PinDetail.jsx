import React, { useState, useEffect } from 'react';
import { BsDownload } from 'react-icons/bs';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { urlFor, client } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery, pinDetailMorePinQuery, userQuery } from '../utils/data'; 
import Spinner from './Spinner';
import { BsThreeDots } from 'react-icons/bs';
import { HiBookmark } from 'react-icons/hi';
import { AiOutlineLink, AiTwotoneDelete } from 'react-icons/ai';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [clickBtn, setClickBtn] = useState(false);
  const [pinPostedBy, setPinPostedBy] = useState(null);
  const { pinId } = useParams();
  const navigate = useNavigate();
  const [pinSave, setPinSave] = useState(false);

  const deletePin = (id) => {
    client
        .delete(id)
        .then(()=>{
            localStorage.feedStatus = true;
            navigate('/');
        })
  }

  const savePin = (id) => {
    if(!pinSave){

        client
            .patch(id)
            .setIfMissing({ save: []})
            .insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id
                }
            }])
            .commit()
            .then(() =>{
              setPinSave(true);
            })
    }
  }

  
  const addComment = () => {
    if(comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: []})
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id,
          }
        }])
        .commit()
        .then( async (status) => {
          localStorage.count = 0;
          await fetchPinDetails(pinId);
          status.comments.forEach((data, index) => {
            client.fetch(userQuery(data.postedBy._ref))
              .then((data) => {
                status.comments[index].postedBy.image = data[0].image;
                status.comments[index].postedBy.userName = data[0].userName;
                localStorage.count = (parseInt(localStorage.count) + 1);
                if(localStorage.count >= status.comments.length){
                  setPinDetail(status);
                }
              })
          })
          setComment('');
          setAddingComment(false);
        })
    }
  }


  const fetchPinDetails = (pinId) => {
    return new Promise((resolve) => {
      let query = pinDetailQuery(pinId);
      if(query) {
        client.fetch(query)
          .then((data)=> {
            setPinDetail(data[0]);
            setPinPostedBy(data[0]);
            if(data[0]) {
              query = pinDetailMorePinQuery(data[0]);
  
              client.fetch(query)
                .then((res) => {
                  setPins(res)
                  resolve(true);
                });
            }
          })
      }
    })
  }

    useEffect(()=>{
      if(localStorage.userStatus === 'true'){
        fetchPinDetails(pinId);
        localStorage.feedStatus = true;
      }else {
        navigate('/login');
      }
      
    },[pinId, navigate])

    useEffect(() => {
      pinPostedBy?.save?.forEach((data)=>{
        if(data.postedBy._id === user._id){
          setPinSave(true);
        }else {
          setPinSave(false);
        }
      })
    }, [user, pinPostedBy],[])
    

    const handleClick = () => {
      if(clickBtn) {
        setClickBtn(false);
      }
    }

    if(!pinDetail) return <Spinner message='Loading pin.'/>


  return (
    <>
      <div className='w-full' onClick={handleClick}>
        <div className='flex h-auto xl:flex-row flex-col m-auto bg-white shadow-2xl overflow-hidden' style={{maxWidth: '1500px', borderRadius: '32px'}}>
          <div className='flex justify-center items-center flex-initial bg-black xl:min-w-[800px]'>
            <div className='flex justify-center items-center'>
              <img 
                src={pinDetail?.image && urlFor(pinPostedBy.image).url()}
                alt='Selected-Pin'
              />
            </div>
          </div>
          <div className='flex flex-col w-full h-auto bg-white'>
            <div>
              <div className='w-full p-5 flex flex-row justify-between'>
                <Link 
                      to={`/user-profile/${pinPostedBy.postedBy?._id}`}
                      className='flex gap-2 items-center bg-white rounded-lg'
                  >
                      <img 
                          src={pinPostedBy.postedBy?.image}
                          alt="user-profile" 
                          className='w-10 h-10 rounded-full object-cover'
                      />
                      <p className='font-semibold capitalize'>{pinPostedBy.postedBy?.userName}</p>
                  </Link>
                <div
                  type='button'
                  onClick={()=> setClickBtn(!clickBtn)}
                  className='text-3xl mr-3 relative p-2 rounded-full hover:bg-[#33ccff] transition-all duration-300 hover:text-white'
                >
                  <BsThreeDots />
                  {clickBtn && (
                    <div className='absolute top-[60px] -left-[250px]'>
                      <div className='flex flex-col justify-start w-[300px] h-auto bg-gray-100 after:absolute after:right-[5px] after:-top-[22px] after:h-0 after:w-0 after:-translate-x-1/2 after:border-[12px] after:border-gray-100 after:border-l-transparent after:border-t-transparent after:border-r-transparent rounded-xl shadow-lg gap-1'>
                        <div className='mt-3 ml-1 hover:bg-gray-200 text-black p-2 m-1 rounded-lg'>
                          {pinSave? (
                            <div
                              type='button'
                              className='flex justify-start cursor-pointer'
                            >
                              <HiBookmark className='text-[#33ccff]'/> <p className='text-xl ml-4'>Saved</p>
                            </div>
                          ) : (
                            <div
                              onClick={(e)=> {
                                e.stopPropagation();
                                savePin(pinId);
                              }}
                              type='button'
                              className='flex justify-start cursor-pointer'
                            >
                              <HiBookmark /> <p className='text-xl ml-4'>Save</p>
                            </div>
                          )}
                          
                        </div>
                        <div className='-mt-2 ml-1 hover:bg-gray-200 text-black p-2 m-1 rounded-lg'>
                          <a 
                              href={`${pinPostedBy.image?.asset?.url}?dl=`}
                              download
                              onClick={(e )=> e.stopPropagation()}
                              className='text-2xl flex justify-start ml-1'
                          >
                              <BsDownload /> <p className='text-xl ml-4'>Download</p>
                          </a>
                        </div>
                        <div className='-mt-2 ml-1 hover:bg-gray-200 text-black p-2 m-1 rounded-lg'>
                          <a 
                              href={pinPostedBy.destination} 
                              target="_blank" 
                              rel='noreferrer'
                              className='flex justify-start'
                            >
                              <AiOutlineLink /> <p className='text-xl ml-4'>Source link</p>
                            </a>
                        </div>
                        {pinDetail.postedBy?._id === user._id && (
                          <div className='-mt-2 ml-1 hover:bg-gray-200 text-black p-2 m-1 rounded-lg'>
                              <button
                                  type='button'
                                  onClick={(e)=> {
                                      e.stopPropagation();
                                      deletePin(pinId);
                                  }}
                                  className='flex justify-start'
                              >
                                  <AiTwotoneDelete /><p className='text-xl ml-4'>Delete</p>
                              </button>
                            </div>
                        )}
                        <div className='mb-1'></div>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
            <div className='ml-4 pr-[20px] mb-[40px]'>
              <h1 className='text-4xl font-bold break-words ml-5'>
                {pinDetail.title}
              </h1>
              <p className='mt-3 mb-3 ml-5'>{pinDetail.about}</p>
              <hr/>
              <h2 className='my-1 text-2xl text-center'>Comments</h2>
              <hr/>
              <div className=' overflow-y-auto'>

                {pinDetail?.comments?.map((comment, i) =>( 
                  <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                    <img
                      src={comment.postedBy.image || comment.postedBy.image2}
                      alt='user-profile'
                      className='w-10 h-10 rounded-full cursor-pointer'
                    />
                    <div className='flex flex-col bg-gray-100 px-4 py-2 rounded-2xl'>
                      <p className='font-bold'>{comment.postedBy.userName || comment.postedBy.userName2 }</p>
                      <p>{comment.comment}</p>
                    </div>
                  </div>

                ))}
              </div>
              <div className='flex flex-wrap mt-6 gap-3'>
              <Link 
                      to={`user-profile/${pinDetail.postedBy?._id}`}
                      className='flex gap-2 items-center bg-white rounded-lg'
                  >
                      <img 
                          src={user?.image}
                          alt="user-profile" 
                          className='w-10 h-10 rounded-full object-cover'
                      />
                  </Link>
                  <input 
                    className='flex-1 flex-wrap border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 mr-3'
                    type='text'
                    placeholder='Write a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <button
                    type='button'
                    className='bg-[#33ccff] text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                    onClick={addComment}
                  >
                    {addingComment ? 'Posting the comment...' : 'Post'}
                  </button>
              </div>
          </div>
          </div>
        </div>
        {pins?.length > 0 ? (
          <>
            <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
              More like this
            </h2>
            <MasonryLayout pins={pins} />
          </>
        ): (
          <Spinner message='Loading more related post...'/>
        )}
      </div>
    </>
  )
}

export default PinDetail