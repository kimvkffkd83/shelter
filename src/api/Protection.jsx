import axios from "axios";

const  API_URL = 'http://localhost:4000/data/protection';
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
    tcnt: async () => {
        try {
            const res = await api.get(`tcnt`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection total cnt data:", error);
            throw error;
        }
    },
    list: async (searchParam, query, pageNo, rowMax) =>{
        try {
            const res = await api.post(searchParam, {pageNo, rowMax, query});
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    },
    vcnt: async (postNo) =>{
        try{
            const res = await api.put(`vcnt`, {postNo});
            return res;
        } catch (error) {
            console.error("Error while updating data vcnt:", error);
            throw error;
        }
    },
    view: async (postNo) => {
        try {
            const res = await api.get(`${postNo}`);
            return res.data;
        } catch (error) {
            console.error("Error while viewing data:", error);
            throw error;
        }
    },
    write: async (data) => {
        try {
            const res = await api.put(``, data);
            return res;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                throw new Error(error.response.data);
            }
            throw new Error('알 수 없는 오류가 발생했습니다.');
        }
    },
    update: async (postNo, data) => {
        try {
            const res = await api.put(`${postNo}`, data);
            return res;
        } catch (error) {
            console.error("Error while writing data:", error);
            throw error;
        }
    },
    remove: async (postNo) => {
        try {
            const res = await api.delete(`${postNo}`);
            return res;
        } catch (error) {
            console.error("Error while removing data:", error);
            throw error;
        }
    },
}

export default API;