import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BTCAzukiSearch.css';

const BTCAzukiSearch = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(6);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://brc721.cc/ord-api/nft-data?tick=Bitcoin%20BEANZ&page=0&limit=19500'
      );
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const wallet = 'bc1paa95ws5wdd9uzvzerd9zgk07ys8c0jjt8fr207dwu0938pskrenqjgd0d7';
      const promises = [];
      
      for (let page = 1; page <= 5; page++) {
        const url = `https://api.hiro.so/ordinals/v1/inscriptions?address=${searchTerm}&limit=60&page=${page}`;
        promises.push(axios.get(url));
      }
      
      const responses = await Promise.all(promises);
      const inscriptionData = responses.flatMap(response => response.data.results);
      console.log(inscriptionData);
      
      if (inscriptionData.length > 0) {
        const matchingInscriptions = data.filter((item) =>
        inscriptionData.some((inscription) => inscription.id === item.Inscription_Id)
      );
      console.log(matchingInscriptions);
      setSearchResult(matchingInscriptions);
      
        setSearchResult(matchingInscriptions);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error fetching inscription data:', error);
    }
  };

  const handleShowAll = () => {
    setSearchResult(null);
  };

  const handleShowMore = () => {
    setVisibleItems(visibleItems + 6); // Increase the number of visible items
  };

  const myString = '{"p": "brc-721","op": "mint","tick":"Bitcoin BEANZ","id":"11055100","ipfs":"ipfs://QmdYeDpkVZedk1mkGodjNmF35UNxwafhFLVvsHrWgJoz6A/beanz_metadata/"}';

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
      <h1>Bitcoin BEANZ Search</h1>
      <div className="search-results">
        <code>{myString}</code>
        <br />
        <br />
        <Link to="https://unisat.io/inscribe">COPY THAT AND TEXT INSCRIBE HERE</Link>
        <div className="search">
          <input
            className="searchInputs"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Wallet Address"
            disabled={isLoading}
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
        <h1 className="num-inscriptions">WE DO NOT OWN NOR CLAIM RIGHT TO THESE IMAGE: This image Is NOT stored on Bitcoin and these Ordinals are NOT Digital Artifacts. The image is generated from the link in the inscription and we did not deploy them.</h1>
          <h2 className="num-inscriptions">Number of Inscriptions: {data.length}</h2>
          {searchResult ? (
            <div className="marketplace">
              {searchResult.map((item) => (
                <div className="marketplace-item" key={item.Inscription_Id}>
                  <img
                    src={`https://ipfs.io/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${item.token_id}.png`}
                    alt={`Image for ${item.Inscription_Id}`}
                  />
                  <p>{item.token_id}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="marketplace">
              {data
                .filter(
                  (item) =>
                    item.Inscription_Id.includes(searchTerm) ||
                    item.ordinalsAddress === searchTerm
                )
                .slice(-visibleItems)
                .map((item) => (
                  <div className="marketplace-item" key={item.Inscription_Id}>
                    <img
                      src={`https://ipfs.io/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${
                        item.token_id - 1
                      }.png`}
                      alt={`Image for ${item.Inscription_Id}`}
                    />
                    <p>{item.token_id - 1}</p>
                  </div>
                ))}
            </div>
          )}
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