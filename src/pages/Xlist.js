import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Xlist.css';
import Table from "./table";
import { Xlistlist } from '../Xlistlist'

function XList() {
    const [data1, setData1] = useState(null); // Initialize the state with null


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://xonbtcapi.azurewebsites.net/wallets');
                const data = await response.json();
                setData1(data); // Update the state with the fetched data
                console.log(data); // Process the retrieved data
            } catch (error) {
                console.error('Error:', error); // Handle any errors
            }
        };

        fetchData();
    }, []); // Empty dependency array to execute the effect only once

    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
    }

    const search = (data) => {
        return data.filter(item =>
          item.address.toLowerCase().includes(query) ||
          (typeof item.og_alloc === 'number' && item.og_alloc >= query)
        );
    };

    return (
        <div>
            <div className="banner">
                <div className="links-container">
                    <Link to="/">X</Link>
                    <Link to="/x-list" className="nav-link">X-List</Link>
                    <Link to="/coming-soon" className="nav-link">X-Profile</Link>
                </div>
            </div>
            <h1>X-List</h1>
            <div className='search'>
                <div className='searchInputs'>
                    <input className='searchInputs'
                        type='text' 
                        placeholder='Enter wallet... '
                        onChange={handleSearch}
                    />
                </div>
            </div>
            
            <Table data={search(data1 || Xlistlist)}/> {/* use data1 from Requests if available*/}

        </div>
    );
}

export default XList;