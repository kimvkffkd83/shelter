import axios from "axios";

const  API_URL = 'http://localhost:5000/img';
const token = localStorage.getItem('token');

const api = axios.create({
    baseURL : API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const API = {
    upload: async (route, img) => {
        try{
            const res = await api.post(`/${route}`, img,{ headers: {
                    "Content-Type": "multipart/form-data",
                },});
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 || error.response.status === 404) {
                    throw new Error(error.response.data);
                }
            }
            throw new Error('알 수 없는 오류가 발생했습니다.');
        }
    }
};

export default API;