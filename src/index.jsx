import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './js/App.js';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
        <App/>
    </BrowserRouter>
);