import {jwtDecode} from 'jwt-decode'
import {useNavigate} from "react-router-dom";

const ath = {
    isLoggedIn:()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        // 토큰 디코딩하여 만료 시간 확인
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    },
    decodeToken:()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        return jwtDecode(token);
    },
    getNameFromToken:() =>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        return jwtDecode(token).userNm;
    },
    isAdmin:()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        // 토큰 디코딩하여 만료 시간 확인
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if(decodedToken.exp > currentTime){
            return decodedToken.userSt === 0;
        }

        return false;
    },
    logout : ()=>{
        localStorage.removeItem('token');
    },
    confirmLogin: (movePage)=>{
        if (!ath.isLoggedIn()) {
            if (window.confirm("로그인이 필요한 기능입니다.\n로그인 하시겠습니까?")) {
                movePage("/login")
            } else {
                movePage(-1)
            }
        }
    }
}

export default ath;