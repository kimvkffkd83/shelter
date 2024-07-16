import {jwtDecode} from 'jwt-decode'
import {redirect, redirectDocument, useLocation} from "react-router-dom";
const ath = {
    isLoggedIn:()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        // 토큰 디코딩하여 만료 시간 확인
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    },
    decodeToken:()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        // 토큰 디코딩하여 만료 시간 확인
        return jwtDecode(token);
    },
    logout : ()=>{
        localStorage.removeItem('token');
    }
}

export default ath;