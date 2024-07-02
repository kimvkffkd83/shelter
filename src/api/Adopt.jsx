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
    listUpdate : async (no, orderNo) => {
        try {
            const res = await api.put(`order/${no}`, {orderNo});
            return res;
        } catch (error) {
            console.error("Error while updating data:", error);
            throw error;
        }
    },
    view : async (no) =>{
        try {
            const res = await api.get(`${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    write :  async (data) =>{
        try {
            const res = await api.post(``, data);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    update : async (no, data) =>{
        try {
            const res = await api.put(`${no}`, data);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    remove : async (no) =>{
        try {
            const res = await api.delete(`${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    }
};

export default API;