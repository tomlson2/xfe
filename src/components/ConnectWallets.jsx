import React, { useState, useEffect } from 'react';
import { getAddress } from 'sats-connect'
import './ConnectWallet.css';

// two props are for monitoring localstorage change
const PopupButton = ({ onWalletChange, onOrdinalsAddressChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState(localStorage.getItem('wallet') || null);
  const [ordinalsAddress, setOrdinalsAddress] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const openPopupMessage = (message) => {
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('ordinalsAddress');
    if (storedAddress) {
      setOrdinalsAddress(storedAddress || null); // Set to null if storedAddress is falsy);
    }
  }, []);

  const handleGetAddressUniSat = async () => {
    const savedWallet = localStorage.getItem('wallet');

    if (savedWallet) {
      setWallet(savedWallet);
      onWalletChange(savedWallet)
      // Show popup indicating wallet is already connected
      openPopupMessage('Wallet is already connected');
      closePopup(); // Close the popup after showing the alert
    } else if (window.unisat) {
      try {
        const accounts = await window.unisat.requestAccounts();
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          localStorage.setItem('wallet', accounts[0]);
          onWalletChange(accounts[0])
          closePopup(); // Close the popup after connecting the wallet
        }
      } catch (err) {
        console.error('Error connecting wallet', err);
      }
    } else {
      closePopup()
      // Show popup indicating UniSat wallet is not installed
      openPopupMessage('UniSat Wallet is not installed.');
    }
  };

  const handleGetAddressXverse = async () => {
    const savedOrdinalsAddress = localStorage.getItem('ordinalsAddress');

    if (savedOrdinalsAddress) {
      setOrdinalsAddress(savedOrdinalsAddress);
      onOrdinalsAddressChange(savedOrdinalsAddress);
      // Show popup indicating address is already connected
      openPopupMessage('Wallet is already connected');
      closePopup(); // Close the popup after showing the alert
    } else {
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

          if (address && address.address) {
            const ordinalsAddress = address.address;
            setOrdinalsAddress(ordinalsAddress);
            localStorage.setItem('ordinalsAddress', ordinalsAddress);
            onOrdinalsAddressChange(ordinalsAddress);
          } else {
            // Handle case when address with purpose "ordinals" is not found
            openPopupMessage('No Xverse wallet found');
          }

          closePopup(); // Close the popup after receiving the address
        },
        onCancel: () => {
          openPopupMessage('Request canceled');
          closePopup();
        },
      };

      try {
        await getAddress(getAddressOptions);
      } catch (error) {
        console.error('Error:', error);
        closePopup()
        openPopupMessage('Xverse Wallet is not installed.');
      }
    }
  };


  return (


    <div>

      {isPopupOpen && (
        <>
          <div className="overlay" onClick={() => setIsPopupOpen(false)} />
          <div className="popup-message" >

            <button className="close-button" onClick={() => setIsPopupOpen(false)}>X</button>

            <div className="message-content">
              {popupMessage}
            </div>

          </div>
        </>
      )}

      <button className="open-button" onClick={openPopup} style={{ textAlign: "center" }}>CONNECT</button>

      {isOpen && (
        <>
          <div className="overlay" onClick={closePopup} />
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={closePopup}>X</button>
              <p className="wallet-text">Choose Wallet</p>
            </div>
            <div className="wallet-buttons">
              <button className="popup-button" onClick={handleGetAddressUniSat}>UNISAT</button>
              <button className="popup-button" onClick={handleGetAddressXverse}>XVERSE</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};


export default PopupButton; 