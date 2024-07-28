import axios from "axios";

const  API_URL = 'http://localhost:4000/data/main/';
const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await API.refreshToken();
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
    }
    return Promise.reject(error);
});

const API = {
    slideList: async () =>{
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
            console.log(res);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice list data:", error);
            throw error;
        }
    },
    rapidList : async (data) =>{
        try {
            const res = await api.post(`rapid`,data);
            console.log(res);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice list data:", error);
            throw error;
        }
    }
};

export default API;