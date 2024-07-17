import axios from "axios";

const API_URL = 'http://localhost:4000';
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
    chkIdDuplication: async (id) =>{
        try {
            //중복 있으면 true/ 중복 아니면 false 형태
            const res = await api.get(`chkIdDuplication/${id}`);
            return res.data[0].result===1;
        } catch (error) {
            console.error("Error while fetching chkIdDuplication", error);
            throw error;
        }
    },
    nSignUp : async (data) =>{
        try {
            const res = await api.post(`nSignUp`, data);
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 || error.response.status === 409) {
                    throw new Error(error.response.data);
                }
            }
        }
    },
    nLogin : async (data) =>{
        try {
            const res = await api.post(`nLogin`, data);
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 || error.response.status === 409) {
                    throw new Error(error.response.data);
                }
            }
        }
    },
    validToken:  async () =>{
        try {
            const res = await api.get(`validToken`);
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 ||
                    error.response.status === 401) {
                    throw new Error(error.response.data);
                }
            }
        }
    },
    refreshToken: async ()=> {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`token`, { token: refreshToken });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        return newToken;
    }
}
export default API;