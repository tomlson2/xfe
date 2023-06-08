import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'font-awesome/css/font-awesome.min.css';
import { Analytics } from '@vercel/analytics/react';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();