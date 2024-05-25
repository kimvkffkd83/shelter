import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './js/App.js';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        {/*아이콘*/}
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
        {/*에디터*/}
        <link rel="stylesheet"
              href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
        />
        <App/>
    </BrowserRouter>
);