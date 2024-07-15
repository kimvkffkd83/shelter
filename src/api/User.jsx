import axios from "axios";

const  API_URL = 'http://localhost:4000/data/user';

const api = axios.create({
    baseURL : API_URL,
})


const API = {
    chkIdDuplication: async (id) =>{
        try {
            //중복 있으면 true/ 중복 아니면 false 형태
            const res = await api.get(`chkIdDuplication/${id}`);
            return res.data[0].result===1;
        } catch (error) {
            console.error("Error while fetching chkIdDuplication", error);
            throw error;
        }
    },
    nSignIn : async (data) =>{
        try {
            const res = await api.post(`nSignIn`, data);
            return res.data;
        } catch (error) {
            if(error.message === '"Network Error"'){
                throw new Error('서버가 연결되지 않았습니다. 관리자에게 문의하세요.');
            } else if (error.response) {
                if (error.response.status === 500 || error.response.status === 409) {
                    throw new Error(error.response.data);
                }
            }
        }
    }
}
export default API;