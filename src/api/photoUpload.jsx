import axios from "axios";

const  API_URL = 'http://localhost:5000/img';

const api = axios.create({
    baseURL : API_URL,
});

const API = {
    upload: async (route, img) => {
        try{
            const res = await api.post(`/${route}`, img,{ headers: {
                    "Content-Type": "multipart/form-data",
                },});
            return res;
        } catch (error) {
            console.error("이미지 업로드 에러 :", error);
            throw error;
        }
    }
};

export default API;