import axios from "axios";

const getData = async (title)=>{
    try {
        return await axios.get('http://localhost:4000/main/'+title)
    } catch (err){
        console.log(err);
    }
}

export default {getData};