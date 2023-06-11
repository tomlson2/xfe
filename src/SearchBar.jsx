import React from 'react'
import { useState } from 'react'
import './SearchBar.css'

export const search = (data, query) => {
    return data.filter(item => item.address.toLowerCase().includes(query));
  }

function SearchBar({ placeholder }) {
    const [query, setQuery] = useState("");



    console.log(query)
    const handleSearch = (e) => {
        setQuery(e.target.value);
    }

    return (
        <div className='search'>
            <div className='searchInputs'>
                <input 
                    type='text' 
                    placeholder={placeholder}
                    onChange={handleSearch}

                />
                
            </div>
            <div className='dataResult'></div>
        </div>
    )
}


export default SearchBar;