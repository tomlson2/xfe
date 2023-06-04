import { Link } from 'react-router-dom';
import './HomePage.css';

function App() {
    return (
        <div>
            <div className="banner">
                <div className="links-container">
                    <Link to="/">X</Link>
                    <Link to="/x-list" className="nav-link">X-List</Link>
                    <Link to="/coming-soon" className="nav-link">X-Profile</Link>
                </div>
            </div>
            <div className="App">
                <div className="xWrapper">
                    <div className="yellowSubtext">welcome to x... proof you were early</div>
                </div>
                <div className="linksWrapper">
                    <a href="https://unisat.io/brc20/XMYR" className="link">10,000 Collection</a>
                    <a href="https://unisat.io/brc20/%F0%9F%97%B4" className="link">100,000 Collection</a>
                </div>
            </div>
        </div>
    );
}

export default App;

