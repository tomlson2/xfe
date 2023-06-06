import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BTCAzukiSearch.css'; // Import the CSS file

const BTCAzukiSearch = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://brc721.cc/ord-api/nft-data?tick=Bitcoin-Azuki'
            );
            setData(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = () => {
        const result = data.find(
            (item) => String(item.deploy_id).includes(searchTerm)
        );
        setSearchResult(result || null); // Set searchResult to null if no result is found
    };

    const handleShowAll = () => {
        setSearchResult(null);
    };

    return (
        <div>
            <div className="banner">
                <div className="links-container">
                    <Link to="/">X</Link>
                    <Link to="/x-list" className="nav-link">
                        X-List
                    </Link>
                    <Link to="/coming-soon" className="nav-link">
                        X-Profile
                    </Link>
                </div>
            </div>
            <h1>BTC Azuki Search</h1>
            {isLoading ? (
                <h2 className="loading">Loading...</h2>
            ) : (
                <h2 className="num-inscriptions">
                    Number of Inscriptions: {data.length}
                </h2>
            )}

            <div className="search-results">
                <div className="search">
                    <input
                        className="searchInputs"
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search deploy ID"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="marketplace">
                    {searchResult && (
                        <div className="marketplace-item">
                            <img
                                src={`https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${searchResult.token_id - 1
                                    }.png`}
                                alt={`Image for ${searchResult.Inscription_Id}`}
                            />
                            <p>{searchResult.deploy_id}</p>
                        </div>
                    )}
                    {!searchResult && searchTerm && (
                        <p className="no-result">No search result</p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default BTCAzukiSearch;
