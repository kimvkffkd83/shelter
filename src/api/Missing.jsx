import axios from "axios";

const  API_URL = 'http://localhost:4000/data/missing';
const token = localStorage.getItem('token');

const api = axios.create({
    baseURL : API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
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
            console.error("Error while writing data:", error);
            throw error;
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