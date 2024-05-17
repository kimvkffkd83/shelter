import axios from "axios";

const  API_URL = 'http://localhost:4000/data/main/';

const api = axios.create({
    baseURL : API_URL,
});

const API = {
    list: async (board) =>{
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