/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {

  const [ loading, setLoading ] = useState(false);
  const [ pins, setPins ] = useState(null);
  const { categoryId } = useParams();
  const [feed, setFeed] = useState(localStorage.feedStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if(feed === 'true'){
        setLoading(true);
        feedRequest(feedQuery);
    }
  
  }, [feed])

  const feedController = (status) => {
    console.log(status)
    if(status){
      setLoading(true);
      client.fetch(feedQuery)
       .then((data) =>{
          setPins(data);
         setLoading(false);
            status = false;
        })
    } 
  }

  async function feedRequest (query) {
    try {
      let response = await client.fetch(query);
      setPins(response);
      localStorage.feedStatus = false;
      setFeed(localStorage.feedStatus);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

  }
  
  useEffect(() => {
    if(localStorage.userStatus === 'true'){
      setLoading(true);
      const query = searchQuery(categoryId);
      if(categoryId){ 
        feedRequest(query);
      }else {
        console.log(`update`);
        feedRequest(feedQuery);

      }
    }else {
      navigate('/login');
    }
    
  }, [categoryId, navigate])

  if(loading) return <Spinner message='We are adding new ideas to your feed!' />
  if(!pins?.length) return <h2 className='text-center text-xl'>No post available!</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} feedController={feedController} />}
    </div>
  )
}

export default Feed