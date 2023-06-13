import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './ConnectWallets';

const Header = () => {
    return (
        <header className='header'>
            <div className='banner'>
                <div className="links-container">
                    <Link to="/" className="nav-link">HOME</Link>
                    <Link to="/x-list" className="nav-link">X-LIST</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
