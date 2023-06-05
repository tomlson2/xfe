import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Xlist.css';

import Table from "./table";
import { Xlistlist } from '../Xlistlist'
import  PopupButton  from '../ConnectWallets.jsx';

function XList() {
    const [wallet, setWallet] = useState(localStorage.getItem('wallet') || null);
    const [inscriptions, setInscriptions] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [data1, setData1] = useState(null); // Initialize the state with null

    const updateWallet = async (walletId) => {
        try {
            await fetch(`http://localhost:5000/wallets/${walletId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: newAddress }),
            });
            fetchInscriptions();
        } catch (err) {
            console.error('Error updating wallet', err);
        }
    };

    const connectWallet = async () => {
        if (window.unisat) {
            try {
                const accounts = await window.unisat.requestAccounts();
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    localStorage.setItem('wallet', accounts[0]);
                    fetchInscriptions(0, 10);
                }
            } catch (err) {
                console.error('Error connecting wallet', err);
            }
        } else {
            console.error('UniSat Wallet is not installed.');
        }
    };

    const fetchInscriptions = async () => {
        try {
            const response = await fetch('http://localhost:5000/wallets');
            const data = await response.json();
            setInscriptions(data);
        } catch (err) {
            console.error('Error fetching wallets', err);
        }
    };

    useEffect(() => {
        if (wallet) {
            fetchInscriptions(0, 10);
        }
    }, [wallet]);

    useEffect(() => {
        if (window.unisat && window.unisat.getInscriptions) {
            console.log('getInscriptions method is available');
        } else {
            console.error('getInscriptions method is not available');
        }
    }, []);

    useEffect(() => {
        if (window.unisat) {
            console.log('UniSat Wallet is available');
        } else {
            console.error('UniSat Wallet is not available');
        }
    }, []);

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

    useEffect(() => {
        if (data1 && PopupButton.ordinalsAddress !== null) {
          // Perform your comparison with savedAddress here
          if (data1.address === PopupButton.ordinalsAddress) {
            console.log('Data address matches the saved address.');
            console.log(PopupButton.ordinalsAddress)
          } else {
            console.log('Data address does not match the saved address.');
          }
        }
      }, [data1]);

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
                    <Link to="/profile" className="nav-link">X-Profile</Link>
                </div>
                
                {/* {wallet && <p className="address">Welcome ..{wallet.slice(-5)}!</p>} */}
                {!wallet && <button onClick={connectWallet}>Connect Wallet</button>}
                <PopupButton />
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

            {/* <table>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>100k holdings</th>
                        <th>10k allocation</th>
                        <th>Burn Bonus</th>
                    </tr>
                </thead>
                <tbody>
                    {inscriptions.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.address}</td>
                            <td>
                                <form onSubmit={() => updateWallet(item.id)}>
                                    <input
                                        value={newAddress}
                                        onChange={e => setNewAddress(e.target.value)}
                                        placeholder="New address"
                                    />
                                    <button type="submit">Update Address</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}

export default XList;
