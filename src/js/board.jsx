import axios from "axios";

const getData = async (title)=>{
    try {
        return await axios.get('http://localhost:4000/data/'+title)
    } catch (err){
        console.log(err);
    }
}

const getCnt = async (title) =>{
    try {
        return await axios.get('http://localhost:4000/data/'+title+'/tcnt')
    } catch (err){
        console.log(err);
    }
}

export default {getData, getCnt};