import mysql from "mysql2";

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'kimvkffkd83',
    password : 'ElQl9753!',
    database : 'shelter_db'
})

conn.connect((err) =>{
    if(err) throw err;
    else console.log('DB Connected')
})

export default conn;