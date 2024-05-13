import axios, {get} from "axios";
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
 const write = async (title,data) =>{
    try {
        return await axios.post('http://localhost:4000/data/'+title+'/write', data);
    } catch (err){
        console.log(err);
    }
}
 const view = async (title, ntcNo) =>{
    try {
        return await axios.get('http://localhost:4000/data/'+title+'/'+ntcNo+'/view')
    } catch (err){
        console.log(err);
    }
}

 const remove = async (title, ntcNo) =>{
     try {
         return await axios.post('http://localhost:4000/data/'+title+'/'+ntcNo+'/remove', ntcNo)
     } catch (err){
         console.log(err);
     }
 }

 const update = async (title, ntcNo, data) =>{
     console.log("update data",data);
     try {
         return await axios.post('http://localhost:4000/data/'+title+'/'+ntcNo+'/update', data)
     } catch (err){
         console.log(err);
     }
 }

export default {getData, getCnt, write, view, remove, update};