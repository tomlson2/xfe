// Xlist.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Xlist.css';
import Table from './table';
import { Xlistlist } from '../Xlistlist';
import PopupButton from '../ConnectWallets.jsx';


const XList = () => {
  const fakeAddress = 'bc1paa95ws5wdd9uzvzerd9zgk07ys8c0jjt8fr207dwu0938pskrenqjgd0d7';
  const [unisatWallet, setUnisatWallet] = useState(localStorage.getItem('wallet') || null);
  const [xverseWallet, setXverseWallet] = useState(localStorage.getItem('ordinalsAddress') || null);
  const [data1, setData1] = useState(null);
  const [isAddressMatched, setIsAddressMatched] = useState(false);
  const [matchedList, setMatchedList] = useState([]);
  const [maxLength, setMaxLength] = useState(10);
  const tableContainerRef = useRef(null);
  const baseURL = "https://unisat.io/brc20?q=";

  useEffect(() => {
    const calculateMaxLength = () => {
      const tableContainerWidth = tableContainerRef.current.offsetWidth;
      const columnCount = 4; // Assuming 4 columns
      const padding = 20; // Adjust padding as needed
      const availableSpace = tableContainerWidth / columnCount - padding;
      setMaxLength(Math.floor(availableSpace / 10)); // Adjust the division value as needed to achieve the desired length
    };

    window.addEventListener("resize", calculateMaxLength);
    calculateMaxLength();

    return () => {
      window.removeEventListener("resize", calculateMaxLength);
    };
  }, []);

  const handleWalletChange = (wallet) => {
    setUnisatWallet(wallet);
    localStorage.setItem('wallet', wallet);
  };

  const handleOrdinalsAddressChange = (ordinalsAddress) => {
    setXverseWallet(ordinalsAddress);
    localStorage.setItem('ordinalsAddress', ordinalsAddress);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://xonbtcapi.azurewebsites.net/wallets');
        const data = await response.json();
        setData1(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const search = (data) => {
    return data.filter(item =>
      item.address.toLowerCase().includes(query.toLowerCase()) ||
      (typeof item.og_alloc === 'number' && !isNaN(query) && item.og_alloc >= parseFloat(query))
    );
  };

  useEffect(() => {
    const foundItem = data1 && data1.find(item => item.address === (unisatWallet || xverseWallet));
    if (foundItem) {
      setIsAddressMatched(true);
      setMatchedList(prevList => {
        if (prevList) {
          // Check if the address already exists in the list
          const addressExists = prevList.some(item => item.address === foundItem.address);
          if (!addressExists) {
            return [...prevList, foundItem].filter(item => item && item.address !== null);
          } else {
            return prevList;
          }
        } else {
          return [foundItem].filter(item => item && item.address !== null);
        }
      });
    } else {
      setIsAddressMatched(false);
  
      const newItem = {
        address: unisatWallet,
        og_alloc: 0,
        new_alloc: 0
      };
  
      const addXverseWallet = xverseWallet && {
        address: xverseWallet,
        og_alloc: 0,
        new_alloc: 0
      };
  
      setMatchedList(prevList => {
        if (prevList) {
          const addressExists = prevList.some(item => item.address === newItem.address);
          const xverseWalletExists = prevList.some(item => item.address === addXverseWallet?.address);
          
          if (!addressExists && !xverseWalletExists) {
            return [...prevList, newItem, addXverseWallet].filter(item => item && item.address !== null);
          } else {
            return prevList;
          }
        } else {
          return [newItem, addXverseWallet].filter(item => item && item.address !== null);
        }
      });
    }
  }, [data1, unisatWallet, xverseWallet]);
  

  return (
    <div>
      <div className="banner">
        <div className="links-container">
          <Link to="/">X</Link>
          <Link to="/x-list" className="nav-link">X-List</Link>
          <Link to="/coming-soon" className="nav-link">X-Profile</Link>
        </div>
        <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: -20, right: 0 }}>
        <PopupButton onWalletChange={handleWalletChange} onOrdinalsAddressChange={handleOrdinalsAddressChange} />
      </div>
      {/* Other elements here */}
    </div>
      </div>
      
      <h1>X-List</h1>
      <div className='search'>
        <div className='searchInputs'>
          <input
            className='searchInputs'
            type='text'
            placeholder='Enter wallet... '
            onChange={handleSearch}
          />
        </div>
      </div>
      <div ref={tableContainerRef} className="table-container">
      {matchedList && Array.isArray(matchedList) && matchedList.length > 0 && ( // Check if matchedList exists, is an array, and is not empty
    <div className="glowing-container">
      <div className="glowing-box">
        {matchedList && (
          <table>
            <thead>
              <tr>
                <th>Your Address</th>
                <th>$XMYR Alloc</th>
                <th>100k Holdings</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(matchedList) ? (
                matchedList.map((item) => (
                  <tr key={item?.address}>
                    <td
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "inline-block",
                        maxWidth: "100%",
                        overflow: "visible",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <a
                        href={baseURL + item?.address}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {item?.address && item.address.length > maxLength
                          ? `${item.address.substr(0, maxLength / 2)}...${item.address.substr(-maxLength / 2)}`
                          : item?.address}
                      </a>
                    </td>
                    <td>{item?.new_alloc}</td>
                    <td>{item?.og_alloc}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "inline-block",
                      maxWidth: "100%",
                      overflow: "visible",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <a
                      href={baseURL + matchedList?.address}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {matchedList?.address && matchedList.address.length > maxLength
                        ? `${matchedList.address.substr(0, maxLength / 2)}...${matchedList.address.substr(-maxLength / 2)}`
                        : matchedList?.address}
                    </a>
                  </td>
                  <td>{matchedList?.new_alloc}</td>
                  <td>{matchedList?.og_alloc}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )}
</div>
<div className="table-container">
  <Table data={search(data1 || Xlistlist)} />
</div>

    </div>
  );
};

export default XList;