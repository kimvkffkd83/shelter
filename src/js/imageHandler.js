// import basicImage from "../../public/img/placeholder-image.jpg"

const ip ={
    error: (e)=> {
        console.log(e.target.src);
        e.target.src = '/public/img/placeholder-image.jpg'
    }
}

export default ip;