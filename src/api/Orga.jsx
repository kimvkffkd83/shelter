import axios from "axios";

const  API_URL = 'http://localhost:4000/data/orga';
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
    list: async () =>{
        try {
            const res = await api.get('/');
            return res.data;
        } catch (error) {
            console.error("Error while fetching department list data:", error);
            throw error;
        }
    },
};

export default API;