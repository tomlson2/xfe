import { Link } from 'react-router-dom';
import './HomePage.css';

function ComingSoon() {
    return (
        <div>
            <div className="banner">
                <div className="links-container">
                    <Link to="/">X</Link>
                    <Link to="/coming-soon" className="nav-link">X-List</Link>
                    <Link to="/coming-soon" className="nav-link">X-Profile</Link>
                </div>
            </div>
            <div className="App">
                <div className="xWrapper">
                    <div className="yellowSubtext">coming soon...</div>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;

