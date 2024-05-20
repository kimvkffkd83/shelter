import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'

const app = express();
const port = 4000 //기본 포트 3000에서 변경해주기

app.use(bodyParser.urlencoded({ extended:false }));
app.use(cors());
app.use(bodyParser.json());

app.get('/data', (req, res) =>{
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

//서버 개시
app.listen(port, ()=>{
    console.log("api 서버 개시 완료")
})

//메인페이지에서 공지사항 조회
app.get("/data/main/:board/list",(req,res) =>{
    const board = req.params.board;
    let tableName,noColumnName,titleColumnName,regDateColumnName;
    
    // board에 따른 테이블과 컬럼 설정
    switch (board) {
        case 'notice':
            tableName = 'master_notice_db';
            noColumnName = 'NTC_NO';
            titleColumnName = 'NTC_TITLE';
            regDateColumnName = 'NTC_REG_DATE';
            break;
        case 'feedback':
            tableName = 'master_feedback_db';
            noColumnName = 'FDB_NO';
            titleColumnName = 'FDB_TITLE';
            regDateColumnName = 'FDB_REG_DATE';
            break;
        // 추가적인 경우에 따라 필요한 테이블과 컬럼 설정
        default:
            res.status(400).send('해당 게시판의 정보는 불러올 수 없습니다.');
            return;
    }

    const query = `SELECT ${noColumnName} as boardNo, ${titleColumnName} AS title, DATE_FORMAT(CAST(${regDateColumnName} AS date), '%Y-%m-%d') AS date FROM ${tableName} ORDER BY ${noColumnName} DESC LIMIT 0,6`;

    db.query(query, (error, rows, fields) =>{
        if (error) {
            console.error(`(server) ${board} 목록 조회 중 에러:`, error);
            res.status(500).send(`${board} 목록을 조회하는 도중 에러가 발생했습니다.`);
            return;
        }
        res.send(rows);
        console.log(`${board} list: `,rows);
    });
})

//공지사항 모든 게시글 수
app.get("/data/notice/tcnt", (req, res) =>{
    db.query('SELECT COUNT(*) AS cnt FROM master_notice_db', (error, tcnt) =>{
        if (error) throw error;
        res.send(tcnt);
    })
})

//공지사항 최신 1페이지 조회
app.get("/data/notice",(req,res) => {
    const pageNo =  req.query?.pageNo?? 1;
    const queryNo = (pageNo-1)*10;
    const sql = `SELECT NTC_NO AS ntcNo, USER_ID AS userId, NTC_TITLE AS title, NTC_CONTENTS AS contents, DATE_FORMAT (CAST( NTC_REG_DATE AS date),'%Y-%m-%d') AS date, NTC_VCONT AS vcnt FROM master_notice_db ORDER BY NTC_NO DESC limit ${queryNo},10`;
    db.query(sql, (error, rows, fields) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//공지사항 게시글 등록
app.post("/data/notice", (req,res) =>{
    const {USER_NO, USER_ID, NTC_TITLE, NTC_CONTENTS, NTC_REG_DATE, NTC_UDT_DATE} = req.body;
    const values = [USER_NO,USER_ID,NTC_TITLE,NTC_CONTENTS,NTC_REG_DATE,NTC_UDT_DATE];
    // console.log("convertedArray",convertedArray);
    db.query('INSERT INTO master_notice_db(user_no, user_id, ntc_title, ntc_contents, ntc_reg_date, ntc_udt_date) values (?,?,?,?,?,?)',values, (error, rows, fields) =>{
        if (error) {
            console.error("(server)공지사항 등록 중 에러:", error);
            res.status(500).send("공지사항을 등록하는 도중 에러가 발생했습니다.");
        }else{
            res.send({ insertedId: res.insertId });
        }
    });
})

// 공지사항 게시글 확인
app.get("/data/notice/:id", (req,res)=>{
    const id = req.params.id;
    if(id) {
        db.query('SELECT NTC_NO AS ntcNo, USER_ID AS userId, NTC_TITLE AS title, NTC_CONTENTS AS contents, DATE_FORMAT (CAST(NTC_REG_DATE AS date),\'%Y-%m-%d\') AS date FROM master_notice_db WHERE NTC_NO=?',id, (error, rows, fields) =>{
            console.log("(server)공지사항 1개 : ",rows);
            if (error) throw error;
            res.send(rows);
        });
    }else{
        console.log(err);
        res.send('There is no id.');
    }
})


//공지사항 조회수
app.put('/data/notice/vcnt',(req,res) =>{
    const id = req.body.ntcNo;
    if(id) {
        db.query('UPDATE master_notice_db SET NTC_VCONT = NTC_VCONT+1 WHERE NTC_NO=?',id,(err,rows) =>{
            if (err) {
                console.error("(server)조회수 추가 중 에러:", err);
                res.status(500).send("조회수 추가 중 에러가 발생했습니다.");
                return;
            }
            res.send(rows);
        })
    }else{
        console.log(err);
        res.send('There is no id.');
    }
})


// 공지사항 게시글 삭제
app.delete('/data/notice/:id', (req, res) =>{
    const id = req.params.id;
    console.log('(server)지울 no',id);

    if(id) {
        db.query('DELETE FROM master_notice_db WHERE ntc_no=?', id, (error, rows, fields) =>{
            if (error) {
                console.error("(server)공지사항 삭제 중 에러:", error);
                res.status(500).send(`${id}번 공지사항을 삭제하는 도중 에러가 발생했습니다.`);
                return;
            }
            if (res.affectedRows === 0) {
                res.status(404).send("해당하는 공지사항이 없습니다.");
                return;
            }
            res.send({ affectedRows: res.affectedRows });
        });
    }else{
        console.log(err);
        res.send('There is no id.');
    }
})

// 공지사항 선택한 게시글 삭제
app.post('/data/notice/selected',(req, res) =>{
    const ntcNos = req.body.ntcNos;
    if(ntcNos.length === 0){
        res.send('There is no id.');
        return;
    }
    let added = '';
    ntcNos.forEach((no,idx)=>{
        added += 'ntc_no='+no;
        if(idx < ntcNos.length-1) added +=' or ';
    })
    const sql = 'DELETE FROM master_notice_db WHERE '+added;
    db.query(sql,(err, rows)=>{
        if (err) {
            console.error("(server)공지사항 다중 삭제 중 에러:", err);
            res.status(500).send("공지사항을 다중 삭제하는 도중 에러가 발생했습니다.");
            return;
        }
        if (res.affectedRows === 0) {
            res.status(404).send("해당하는 공지사항이 없습니다.");
            return;
        }
        res.send(rows);
    })
})


// 공지사항 게시글 수정
app.put('/data/notice/:id', (req, res) =>{
    const id = req.params.id;
    console.log("req.body",req.body);
    const {USER_NO, USER_ID, NTC_TITLE, NTC_CONTENTS, NTC_UDT_DATE} = req.body;
    const values = [USER_NO,USER_ID,NTC_TITLE,NTC_CONTENTS,NTC_UDT_DATE, id];

    if(id) {
        db.query('UPDATE master_notice_db SET USER_NO = ?, USER_ID = ?, NTC_TITLE=?, NTC_CONTENTS=?, NTC_UDT_DATE = ? WHERE NTC_NO=?', values, (error, rows, fields) =>{
            if (error) {
                console.error("(server)공지사항 수정 중 에러:", error);
                res.status(500).send("공지사항을 수정하는 도중 에러가 발생했습니다.");
                return;
            }
            if (res.affectedRows === 0) {
                res.status(404).send("해당하는 공지사항이 없습니다.");
                return;
            }
            res.send(rows);
        });
    }else{
        console.log(err);
        res.send('There is no id.');
    }
})

//조직도
app.get('/data/orga',(req,res)=>{
    db.query('SELECT DPT_NAME AS dname, DPT_RANK AS drank, DPT_TASK AS dtask, DPT_CALL AS dcall, DPT_MAIL AS dmail FROM master_department_db ORDER BY DPT_RANK', (err,rows)=>{
        if (err) {
            console.error("(server)조직도(부서) 에러:", err);
        }
        res.send(rows);
    })
})