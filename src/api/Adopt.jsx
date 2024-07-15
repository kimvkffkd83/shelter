import axios from "axios";

const  API_URL = 'http://localhost:4000/data/adoption';
const token = localStorage.getItem('token');

const api = axios.create({
    baseURL : API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const API = {
    write:  async (data) =>{
        try {
            const res = await api.post(``, data);
            return res.data;
        } catch (error) {
            console.error("Error while writing data", error);
            throw error;
        }
    },
    list : async (no) =>{
        try {
            const res = await api.get(`${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
},
    reviewList : async (query, pageNo, rowMax) =>{
        try {
            const res =  await api.post( 'review/list', {pageNo, rowMax, query});
            return res.data;
        } catch (error) {
            console.error("Error while fetching adopt list data:", error);
            throw error;
        }
    },
    reviewView : async (no) =>{
        try {
            const res = await api.get(`review/${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    reviewVcnt : async (no) =>{
        try{
            const res = await api.put(`review/vcnt`, {no});
            return res;
        } catch (error) {
            console.error("Error while updating data vcnt:", error);
            throw error;
        }
    },
    reviewWrite : async (data) =>{
        try {
            const res = await api.post(`review`, data);
            return res.data;
        } catch (error) {
            console.error("Error while writing data:", error);
            throw error;
        }
    },
    tabList: async () =>{
        try {
            const res = await api.get(`tab/list`);
            return res.data;
        } catch (error) {
            console.error("Error while fetching adopt list data:", error);
            throw error;
        }
    },
    tabListUpdate : async (no, orderNo) => {
        try {
            const res = await api.put(`tab/order/${no}`, {orderNo});
            return res;
        } catch (error) {
            console.error("Error while updating data:", error);
            throw error;
        }
    },
    tabView : async (no) =>{

        console.log("4")
        try {
            const res = await api.get(`tab/${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    tabWrite :  async (data) =>{
        try {
            const res = await api.post(`tab`, data);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    tabUpdate : async (no, data) =>{
        try {
            const res = await api.put(`tab/${no}`, data);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    },
    tabRemove : async (no) =>{
        try {
            const res = await api.delete(`tab/${no}`);
            return res.data;
        } catch (error) {
            console.error("Error while view data:", error);
            throw error;
        }
    }
};

export default API;