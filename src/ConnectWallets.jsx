import React, { useState } from 'react';
import { getAddress } from 'sats-connect'


const PopupButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState(localStorage.getItem('wallet') || null);
  const [inscriptions, setInscriptions] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [ordinalsAddress, setOrdinalsAddress] = useState(localStorage.getItem('ordinalsAddress') || '');

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleGetAddressUniSat = async () => {
    if (window.unisat) {
      try {
          const accounts = await window.unisat.requestAccounts();
          if (accounts.length > 0) {
              setWallet(accounts[0]);
              localStorage.setItem('wallet', accounts[0]);
              
          }
      } catch (err) {
          console.error('Error connecting wallet', err);
      }
  } else {
      console.error('UniSat Wallet is not installed.');
    }
  };

  const handleGetAddressXverse = async () => {
    const getAddressOptions = {
      payload: {
        purposes: ['ordinals', 'payment'],
        message: 'Address for receiving Ordinals and payments',
        network: {
          type: 'Mainnet'
        },
      },
      onFinish: (response) => {
        console.log(response);

        const address = response.addresses.find((addr) => addr.purpose === 'ordinals');

        if (address) {
          const ordinalsAddress = address.address;
          setOrdinalsAddress(ordinalsAddress);
          localStorage.setItem('ordinalsAddress', ordinalsAddress);
        } else {
          // Handle case when address with purpose "ordinals" is not found
        }

        closePopup(); // Close the popup after receiving the address
      },
      onCancel: () => alert('Request canceled'),
    };

    try {
      await getAddress(getAddressOptions);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button className="open-button" onClick={openPopup}>Connect Wallet</button>

      {isOpen && (
        <>
          <div className="overlay" onClick={closePopup} />
          <div className="popup">
            <div className="popup-content">
              <p>Choose your wallet...</p>
              <button className="close-button" onClick={closePopup}>Close</button>
            </div>
            <div className="wallet-buttons">
              <button onClick={handleGetAddressUniSat}>UNISAT WALLET</button>
              <button onClick={handleGetAddressXverse}>XVERSE WALLET</button>
            </div>
          </div>
        </>
      )}

      {ordinalsAddress && (
        <div>
          <p>Ordinals Address: {ordinalsAddress && wallet}</p>
        </div>
      )}

      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.39);
          z-index: 9998;
        }

        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -90%);
          background: #fff;
          padding: 20px;
          border: 1px solid #ccc;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          z-index: 9999;
        }

        .popup-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .open-button {
          font-size: 18px;
          padding: 10px 20px;
          height: 55px; /* Set the desired height */
          width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .close-button {
          font-size: 14px;
          padding: 5px 10px !important;
        }

        .wallet-buttons {
          margin-top: 10px;
        }

        .popup-open {
          // overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PopupButton;
