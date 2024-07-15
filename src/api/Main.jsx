import axios from "axios";

const  API_URL = 'http://localhost:4000/data/main/';
const token = localStorage.getItem('token');

const api = axios.create({
    baseURL : API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const API = {
    slideList: async (board) =>{
        try {
            const res = await api.get(`slide`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice list data:", error);
            throw error;
        }
    },
    boardList: async (board) =>{
        try {
            const res = await api.get(`${board}/list`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice list data:", error);
            throw error;
        }
    },

};

export default API;