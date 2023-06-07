import GameComponent from '../components/GameComponent';
import { Link } from 'react-router-dom';

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
                <GameComponent />
            </div>
        </div>
    );
}

export default App;



