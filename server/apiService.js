import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'
// const express = require('express');
// const cors = require("cors");
// const bodyParser = require("body-parser");

const app = express();
const port = 4000 //기본 포트 3000에서 변경해주기

app.use(bodyParser.urlencoded({ extended:false }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send("Hello World!")
})

app.post("/text", (req, res) =>{
    console.log("req :",req)
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
    // db.query('SELECT * FROM master_post_db', (error, rows, fields) =>{
    //     if(error) throw error;
    //     console.log('post info is: ',rows);
    // });
    console.log("돌리랑 도트가 제일 좋아")
})

app.get("/main/notice",(req,res) =>{
    db.query('SELECT NTC_TITLE AS title, DATE_FORMAT (CAST( NTC_REG_DATE AS date),\'%Y-%m-%d\') AS date FROM master_notice_db limit 0,6', (error, rows, fields) =>{
        if(error) throw error;

        res.send(rows);
        console.log('notice info is: ',rows);
    });
})


app.get("/main/feedback",(req,res) =>{
    db.query('SELECT FDB_TITLE AS title, DATE_FORMAT (CAST( FDB_REG_DATE AS date),\'%Y-%m-%d\') AS date, FDB_ST as st FROM master_feedback_db limit 0,6', (error, rows, fields) =>{
        if(error) throw error;

        res.send(rows);
        console.log('notice info is: ',rows);
    });
})