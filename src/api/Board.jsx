import axios from "axios";

const  API_URL = 'http://localhost:4000/data/notice';

const api = axios.create({
    baseURL : API_URL,
});

const API = {
    tcnt: async () => {
        try {
            const res = await api.get(`tcnt`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice total cnt data:", error);
            throw error;
        }
    },
    list: async (pageNo) =>{
        try {
            const res = await api.get(`?pageNo=${pageNo}`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching notice list data:", error);
            throw error;
        }
    },
    write: async (data) => {
        try {
            const res = await api.post(``, data);
            return res;
        } catch (error) {
            console.error("Error while writing data:", error);
            throw error;
        }
    },
    view: async (ntcNo) => {
        try {
            const res = await api.get(`${ntcNo}`);
            return res.data;
        } catch (error) {
            console.error("Error while viewing data:", error);
            throw error;
        }
    },
    remove: async (ntcNo) => {
        try {
            const res = await api.delete(`${ntcNo}`);
            return res;
        } catch (error) {
            console.error("Error while removing data:", error);
            throw error;
        }
    },
    update: async (ntcNo, data) => {
        try {
            const res = await api.put(`${ntcNo}`, data);
            return res;
        } catch (error) {
            console.error("Error while updating data:", error);
            throw error;
        }
    },
};

export default API;