import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from './Routing';
import reportWebVitals from './reportWebVitals';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/app.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routing />
  </Router>
);

reportWebVitals();
