import axios from "axios";

const  API_URL = 'http://localhost:4000/data/volunteer';

const api = axios.create({
    baseURL : API_URL,
})

const API = {
    list : async () =>{
        try {
            const res = await api.get('');
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    },
    dayList : async (date) =>{
        try {
            const res = await api.get(`${date}`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    },
    apply: async (data) =>{
        try {
            const res = await api.post('apply',data);
            return res.data;
        } catch (error) {
            console.error("Error while fetching protection list data:", error);
            throw error;
        }
    }
}

export default API;