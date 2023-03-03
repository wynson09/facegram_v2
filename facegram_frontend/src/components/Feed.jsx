import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {

  const [ loading, setLoading ] = useState(false);
  const [ pins, setPins ] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    const query = searchQuery(categoryId);
    if(categoryId){     
      client.fetch(query)
        .then((data) =>{
          setPins(data);
          setLoading(false);
        })
    }else {
      client.fetch(feedQuery)
        .then((data) =>{
          setPins(data);
          setLoading(false);
          console.log(data);
        })
    }
  }, [categoryId])

  if(loading) return <Spinner message='We are adding new ideas to your feed!' />
  if(!pins?.length) return <h2 className='text-center text-xl'>No post available!</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed