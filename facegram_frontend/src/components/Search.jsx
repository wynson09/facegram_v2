import React, { useState, useEffect } from 'react';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(searchTerm) {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })

    }else {
      //error because you change the feedquery in data.js
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    }
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message='Now Searching...' />}
      {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center'>No search found!</div>
      )}
    </div>
  )
}

export default Search