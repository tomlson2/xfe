import React, { useState, useEffect } from 'react';
import { getAddress } from 'sats-connect'


const PopupButton = () => {
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
      // Show popup indicating wallet is already connected
      openPopupMessage('Wallet is already connected');
      closePopup(); // Close the popup after showing the alert
    } else if (window.unisat) {
      try {
        const accounts = await window.unisat.requestAccounts();
        if (accounts.length > 0) {
          console.log(accounts[0]);
          setWallet(accounts[0]);
          localStorage.setItem('wallet', accounts[0]);
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
      // Show popup indicating address is already connected
      openPopupMessage('Address is already connected');
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
          } else {
            // Handle case when address with purpose "ordinals" is not found
            openPopupMessage('No Xverse wallet found');
          }
  
          closePopup(); // Close the popup after receiving the address
        },
        onCancel: () => openPopupMessage('Request canceled'),
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

  useEffect(() => {
    if (ordinalsAddress) {
      // Do something with the ordinalsAddress, e.g., send it to a parent component or an API
      console.log('Ordinals Address:', ordinalsAddress);
    }
  }, [ordinalsAddress]);

  return (

    
    <div>

      {isPopupOpen && (
        <>
        <div className="overlay" onClick={() => setIsPopupOpen(false)} />
        <div className="popup-message" >
          
          <button className="close-button" onClick={() => setIsPopupOpen(false)}>Close</button>
          
            <div >
            {popupMessage}
            </div>
          
        </div>
        </>
      )}

      <button className="open-button" onClick={openPopup}>Connect Wallet</button>

      {isOpen && (
        <>
          <div className="overlay" onClick={closePopup} />
          <div className="popup">
            <div className="popup-content">
              
              <button className="close-button" onClick={closePopup}>Close</button>
              <p className="wallet-text">Choose <br/>Wallet</p>
            </div>
            <div className="wallet-buttons">
              <button onClick={handleGetAddressUniSat}>UNISAT WALLET</button>
              <button onClick={handleGetAddressXverse}>XVERSE WALLET</button>
            </div>
          </div>
        </>
      )}

        {ordinalsAddress && wallet && (
          <div>
            <p>
              {ordinalsAddress.slice(-5) && <span>Xverse: ...{ordinalsAddress.slice(-5)}</span>}
              {ordinalsAddress.slice(-5) && wallet.slice(-5) && <br />}
              {wallet.slice(-5) && <span>Unisat: ...{wallet.slice(-5)}</span>}
            </p>
          </div>
        )}

        {!ordinalsAddress && !wallet && (
          <div>
            <p>No wallets connected.</p>
          </div>
        )}

        {ordinalsAddress && !wallet && (
          <div>
            <p>Xverse: ...{ordinalsAddress.slice(-5)}</p>
          </div>
        )}

        {!ordinalsAddress && wallet && (
          <div>
            <p>Unisat: ...{wallet.slice(-5)}</p>
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
          background: #1c1c1c;
          padding: 16px;
          border: 3px solid #131313;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          border-radius: 10px;
          min-width: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .popup-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.5);
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
          padding: 10px 8px !important;
          width: 60px; /* Adjust the width to make the button smaller */
          height: 34px;
          position: absolute;
          top: -8px; /* Adjust the top position as per your preference */
          right: -8px; /* Adjust the right position as per your preference */
        }

        .wallet-buttons {
          margin-top: 1px;
        }

        .wallet-text {
          font-size: 2rem; /* You can adjust the font size to your preference */
          margin-top: 20px; /* Adjust the margin top value to create spacing */
          
          text-align: center
        }

        .popup-open {
          // overflow: hidden;
        }

        .popup-message {
          position: fixed;
          top: 20px; /* Adjust the top position as needed */
          right: 20px; /* Adjust the right position as needed */
          transform: translate(0, 0);
          background: #1c1c1c;
          padding: 16px;
          border: 3px solid #131313;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          border-radius: 10px;
          max-width: 180px;
          min-width: 150px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.5);
          flex-wrap: wrap;
        }
        
        .popup-message .close-button {
          font-size: 14px;
          padding: 10px 8px !important;
          width: 60px;
          height: 34px;
          order: 1;
          margin-left: auto;
          white-space: nowrap;
        }

      `}</style>
    </div>
  );
};

export default PopupButton; 