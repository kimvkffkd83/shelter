import axios from "axios";

const  API_URL = 'http://localhost:4000/data/volunteer';
const token = localStorage.getItem('token');

const api = axios.create({
    baseURL : API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const API = {
    list : async () =>{
        try {
            const res = await api.get('');
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    },
    dayList : async (date) =>{
        try {
            const res = await api.get(`${date}`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    },
    apply: async (data) =>{
        try {
            const res = await api.post('apply',data);
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 || error.response.status === 409) {
                    throw new Error(error.response.data);
                }
            }
            throw new Error('알 수 없는 오류가 발생했습니다.');
        }
    },
    chkBeforeApply: async (data) =>{
        try {
            const res = await api.post(`chk`,data);
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    }
}

export default API;