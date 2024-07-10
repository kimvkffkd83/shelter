import axios from "axios";

const  API_URL = 'http://localhost:5001/file';

const api = axios.create({
    baseURL : API_URL,
});

const API = {
    upload: async (route, file) => {
        try{
            const res = await api.post(`/${route}`, file,{ headers: {
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
    },
    download: async (fileName) => {
        try{
            const res = await api.post(``, {fileName});
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