import {jwtDecode} from 'jwt-decode'

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
    }
}

export default ath;