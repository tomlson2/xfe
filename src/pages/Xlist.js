
import React, { useState, useEffect } from 'react';
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

  const handleWalletChange = (wallet) => {
    setUnisatWallet(wallet);
    localStorage.setItem('wallet', wallet);
  };

  const handleOrdinalsAddressChange = (ordinalsAddress) => {
    setXverseWallet(ordinalsAddress);
    localStorage.setItem('ordinalsAddress', ordinalsAddress);
  };

  useEffect(() => {
    // Perform your comparison with savedAddress here
    const foundItem = data1 && data1.find(item => item.address === (unisatWallet || xverseWallet));
    if (foundItem) {
      console.log('Data address matches the saved address.');
      console.log(unisatWallet || xverseWallet);
    } else {
      console.log('Data address does not match the saved address.');
      console.log(unisatWallet || xverseWallet);
    }
  }, [data1, unisatWallet, xverseWallet]);  


    // useEffect(() => {
    //     if (window.unisat && window.unisat.getInscriptions) {
    //         console.log('getInscriptions method is available');
    //     } else {
    //         console.error('getInscriptions method is not available');
    //     }
    // }, []);

    // useEffect(() => {
    //     if (window.unisat) {
    //         console.log('UniSat Wallet is available');
    //     } else {
    //         console.error('UniSat Wallet is not available');
    //     }
    // }, []);

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
          item.address.toLowerCase().includes(query.toLowerCase()) ||
          (typeof item.og_alloc === 'number' && !isNaN(query) && item.og_alloc >= parseFloat(query))
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
                
                {/* {wallet && <p className="address">Welcome ..{wallet.slice(-5)}!</p>} */}
                {/* {!wallet && <button onClick={connectWallet}>Connect Wallet</button>} */}
                <PopupButton onWalletChange={handleWalletChange} onOrdinalsAddressChange={handleOrdinalsAddressChange}/>
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
            <div class="table-container">
            <Table data={search(data1 || Xlistlist)}/> {/* use data1 from Requests if available*/}
            </div>
        </div>
    );
}

export default XList;
