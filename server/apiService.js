const express = require('express');
const app = express();
const port = 4000 //기본 포트 3000에서 변경해주기

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended:false }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send("Hello World!")
})

app.post("/text", (req, res) =>{
    //req
    const text1 = req.body.inText;
    console.log(text1);

    //res
    const sendText = {
        text : "성공!"
    };
    res.send(sendText);
})

app.listen(port, ()=>{
    console.log("돌리랑 도트가 제일 좋아")
})