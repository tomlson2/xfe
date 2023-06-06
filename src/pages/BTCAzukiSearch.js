import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BTCAzukiSearch.css'; // Import the CSS file

const BTCAzukiSearch = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleItems, setVisibleItems] = useState(6); // Number of items initially visible

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
        const result = data.find((item) =>
            String(item.Inscription_Id).includes(searchTerm)
        );
        setSearchResult(result || null);
    };

    const handleShowAll = () => {
        setSearchResult(null);
    };

    const handleShowMore = () => {
        setVisibleItems(visibleItems + 6); // Increase the number of visible items
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
            <div className="search-results">
                <div className="search">
                    <input
                        className="searchInputs"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Inscription ID"
                        disabled={isLoading} // Disable search bar until data is loaded
                    />
                    <button onClick={handleSearch} disabled={isLoading}>
                        Search
                    </button>
                </div>

            </div>
            {isLoading ? (
                <h2 className="loading">Loading...</h2>
            ) : (
                <>
                    <h2 className="num-inscriptions">
                        Number of Inscriptions: {data.length}
                    </h2>
                    {searchResult && (
                        <div className="marketplace">
                            <div className="marketplace-item">
                                <img
                                    src={`https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${searchResult.token_id - 1
                                        }.png`}
                                    alt={`Image for ${searchResult.Inscription_Id}`}
                                />
                                <p>{searchResult.token_id - 1}</p>
                            </div>
                        </div>
                    )}

                    <div className="marketplace">
                        {data.slice(0, visibleItems).reverse().map((item) => (
                            <div className="marketplace-item" key={item.Inscription_Id}>
                                <img
                                    src={`https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${item.token_id - 1
                                        }.png`}
                                    alt={`Image for ${item.Inscription_Id}`}
                                />
                                <p>{item.token_id - 1}</p>
                            </div>
                        ))}
                    </div>
                    {visibleItems < data.length && (
                        <button className="show-more" onClick={handleShowMore}>
                            Show More
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default BTCAzukiSearch;

