import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './js/App.js';
import {BrowserRouter} from "react-router-dom";
import User from "./api/User.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try{
            await User.validToken()
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 401) {
                try {
                    // 토큰 갱신
                    const newToken = await User.refreshToken();
                    console.log('토큰이 갱신되었습니다:', newToken);
                } catch (refreshErr) {
                    console.log('리프레시 토큰 갱신 실패:', refreshErr);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    alert('유효하지 않은 접근으로 로그아웃되었습니다.');
                }
            } else {
                localStorage.removeItem('token');
                alert('유효하지 않은 접근으로 로그아웃되었습니다.');
            }
        }
    }
});

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