import axios from "axios";

const  API_URL = 'http://localhost:4000/data/adoption';

const api = axios.create({
    baseURL : API_URL,
});

const API = {
    list: async () =>{
        try {
            const res = await api.get(``);
            return res.data;
        } catch (error) {
            console.error("Error while fetching adopt list data:", error);
            throw error;
        }
    },
};

export default API;