import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './HomePage.css';

function App() {
    return (
        <div>
            <Header />
            <div className="App">
                <div className="xWrapper">
                    <h5>X</h5>
                    <div className="yellowSubtext">
                        <p>JOIN THE 100K CLUB, JOIN THE  <Link to="/x-list" className='link'>X-LIST</Link>.</p>
                    </div>
                    <div className="linksWrapper">
                        <a href="https://unisat.io/brc20/%F0%9F%97%B4" className="link">100,000 Collection</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

