import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { urlFor, client } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data'; 
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

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
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails(pinId);
          setComment('');
          setAddingComment(false);
        })
    }
  }


  const fetchPinDetails = (pinId) => {
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
        .then((data)=> {
          setPinDetail(data[0]);
          if(data[0]) {
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res) => setPins(res));
          }
        })
    }
  }

    useEffect(()=>{
      fetchPinDetails(pinId);
    },[pinId])

    if(!pinDetail) return <Spinner message='Loading pin.'/>

  return (
    <>
    <div className='flex xl:flex-row flex-col m-auto bg-white shadow-2xl overflow-hidden' style={{maxWidth: '1500px', borderRadius: '32px'}}>
      <div className='flex justify-center items-center md:items-start flex-initial bg-gray-200 min-w-[500px]'>
        <img 
          src={pinDetail?.image && urlFor(pinDetail.image).url()}
          alt='Selected-Pin'
        />
      </div>
      <div className='flex flex-col'>
        <div>
          <div className='w-full p-5 flex flex-row justify-between xl:min-w-[780px]'>
            <Link 
                  to={`/user-profile/${pinDetail.postedBy?._id}`}
                  className='flex gap-2 items-center bg-white rounded-lg'
              >
                  <img 
                      src={pinDetail.postedBy?.image}
                      alt="user-profile" 
                      className='w-10 h-10 rounded-full object-cover'
                  />
                  <p className='font-semibold capitalize'>{pinDetail.postedBy?.userName}</p>
              </Link>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <a 
                    href={`${pinDetail.image?.asset?.url}?dl=`}
                    download
                    onClick={(e )=> e.stopPropagation()}
                    className='bg-gray-300 w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none mr-2'
                >
                    <MdDownloadForOffline />
                </a>
              </div>
              <a 
                href={pinDetail.destination} 
                target="_blank" 
                rel='noreferrer'
                className='bg-gray-300 flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
              >
                {pinDetail.destination.length > 15 ? `${pinDetail.destination.slice(8, 15)}...` : pinDetail.destination}
              </a>
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
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map((comment, i) =>( 
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                <img
                  src={comment.postedBy.image}
                  alt='user-profile'
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
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
                className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 mr-3'
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
    </>
  )
}

export default PinDetail