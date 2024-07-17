import axios from "axios";

const  API_URL = 'http://localhost:5000/img';
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