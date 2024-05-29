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
            if(error.message === '"Network Error"'){
                console.log('There was a network error.');
            }
        }
    }
};

export default API;