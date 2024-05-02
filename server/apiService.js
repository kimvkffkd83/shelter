import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

// const express = require('express');
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const mysql2 = require('mysql2');

const app = express();
const port = 4000 //기본 포트 3000에서 변경해주기

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

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'kimvkffkd83',
    password : 'ElQl9753!',
    database : 'shelter_db'
})

connection.connect();

connection.query('SELECT * FROM master_post_tb', (error, rows, fields) =>{
    if(error) throw error;
    console.log('post info is: ',rows);
});

connection.end();