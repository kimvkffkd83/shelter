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
//메인페이지에서 슬라이드 조회
app.get("/data/main/slide",(req,res)=>{
    const query = `SELECT POST_NO AS postNo, USER_ID AS userId, USER_PHONE AS userPhone, POST_ST_SUB AS stSub, 
       DATE_FORMAT (CAST( POST_REG_YMD AS date),'%Y-%m-%d') AS rDate, DATE_FORMAT (CAST( ANM_RSC_YMD AS date),'%Y-%m-%d') AS cDate, 
       DATE_FORMAT (CAST( ANM_STAY_YMD AS date),'%Y-%m-%d') AS sDate, ANM_SPC AS spc, ANM_SPC_SUB AS spcSub,
       ANM_REGION AS region, ANM_REGION_SUB AS regionSub, ANM_NM AS name, ANM_SEX AS sex, ANM_NEUTERING_ST AS ntr, 
       ANM_CHIP_ST AS chip, ANM_COLOR AS color, ANM_WEIGHT AS weight, ANM_BIRTH_YEAR AS bYear, ANM_BIRTH_MONTH AS bMonth, 
       ANM_AGE_UNKNOWN AS ageUnknown, ANM_FEATURE AS feature, POST_VCNT AS vcnt, POST_PHOTO_URL AS photoUrl, POST_PHOTO_THUMB AS photoThumb
       FROM master_anm_post_db WHERE POST_ST = 2 ORDER BY POST_NO DESC limit 0,10;`;

    db.query(query, (error, rows) =>{
        if (error) {
            console.error(`(server) 보호 목록 조회 중 에러:`, error);
            res.status(500).send(`보호 목록을 조회하는 도중 에러가 발생했습니다.`);
            return;
        }
        res.send(rows);
    });
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
    const isUdmin = true;
    const pageNo =  req.query?.pageNo?? 1;
    const queryNo = (pageNo-1)*10;
    let sql = '';
    if(isUdmin){
        sql = `SELECT NTC_NO AS ntcNo, USER_ID AS userId, NTC_TITLE AS title, NTC_CONTENTS AS contents, DATE_FORMAT (CAST( NTC_REG_DATE AS date),'%Y-%m-%d') AS date, NTC_VCNT AS vcnt, NTC_DISPLAY AS display FROM master_notice_db ORDER BY NTC_NO DESC limit ${queryNo},10`;
    }else{
        sql = `SELECT NTC_NO AS ntcNo, USER_ID AS userId, NTC_TITLE AS title, NTC_CONTENTS AS contents, DATE_FORMAT (CAST( NTC_REG_DATE AS date),'%Y-%m-%d') AS date, NTC_VCNT AS vcnt FROM master_notice_db WHERE NTC_DISPLAY='y' ORDER BY NTC_NO DESC limit ${queryNo},10`;
    }
    db.query(sql, (error, rows, fields) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//공지사항 게시글 등록
app.post("/data/notice", (req,res) =>{
    const {USER_NO, USER_ID, NTC_TITLE, NTC_CONTENTS, NTC_REG_DATE, NTC_UDT_DATE} = req.body;
    const values = [USER_NO,USER_ID,NTC_TITLE,NTC_CONTENTS,NTC_REG_DATE,NTC_UDT_DATE];
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
        db.query('SELECT NTC_NO AS ntcNo, USER_ID AS userId, NTC_TITLE AS title, NTC_CONTENTS AS contents, DATE_FORMAT (CAST(NTC_REG_DATE AS date),\'%Y-%m-%d\') AS date, NTC_DISPLAY AS display FROM master_notice_db WHERE NTC_NO=?',id, (error, rows, fields) =>{
            console.log("(server)공지사항 1개 : ",rows);
            if (error) throw error;
            res.send(rows);
        });
    }else{
        res.send('There is no id.');
    }
})


//공지사항 조회수
app.put('/data/notice/vcnt',(req,res) =>{
    const id = req.body.ntcNo;
    if(id) {
        db.query('UPDATE master_notice_db SET NTC_VCNT = NTC_VCNT+1 WHERE NTC_NO=?',id,(err,rows) =>{
            if (err) {
                console.error("(server)조회수 추가 중 에러:", err);
                res.status(500).send("조회수 추가 중 에러가 발생했습니다.");
                return;
            }
            res.send(rows);
        })
    }else{
        res.send('There is no id.');
    }
})

//공지사항 show/hide
app.put('/data/notice/display',(req,res) =>{
    const id = req.body.ntcNo;
    const display = req.body.visible;
    const oppoDisplay = display === 'y'? 'n' : display === 'n'? 'y' : false;
    if(id && oppoDisplay) {
        db.query(`UPDATE master_notice_db SET NTC_DISPLAY='${oppoDisplay}' WHERE NTC_NO=?`,id,(err,rows) =>{
            if (err) {
                console.error("(server)게시글 show/hide 중 에러:", err);
                res.status(500).send("게시글 show/hide 중 에러가 발생했습니다.");
                return;
            }
            res.send(rows);
        })
    }else{
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
        res.send('There is no id.');
    }
})

// 공지사항 선택한 게시글 삭제
app.post('/data/notice/delSelection',(req, res) =>{
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
    const sql = `DELETE FROM master_notice_db WHERE ${added}`;
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

// 공지사항 선택한 게시글 비공개
app.post('/data/notice/hideSelection',(req, res) =>{
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
    const sql = `UPDATE master_notice_db SET NTC_DISPLAY=\'n\' WHERE +${added}`;
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

//보호 모든 게시글 수
app.get("/data/protection/tcnt", (req, res) =>{
    db.query('SELECT COUNT(*) AS cnt FROM master_anm_post_db WHERE POST_ST = 2', (error, tcnt) =>{
        if (error) throw error;
        res.send(tcnt);
    })
})

//보호 모든 게시글
app.post('/data/protection',(req,res) =>{
    const rowMax = Number(req.body.rowMax) > 0 ? Number(req.body.rowMax) : 10;
    const pageNo = Number(req.body.pageNo) > 0 ? Number(req.body.pageNo) : 1;
    const queryNo = (pageNo-1)*rowMax;

    let spc = '';
    if(req.query.ctgr){
        switch (req.query.ctgr){
            case 'dog': spc = '1'; break;
            case 'cat': spc = '2'; break;
            case 'etc': spc = '3'; break;
            default: spc='';
        }
    }
    let region = req.body.query?.region?? 0;
    let st = req.body.query?.st?? '';
    let sex = req.body.query?.sex?? '';
    let ntr = req.body.query?.ntr?? '';
    let chip = req.body.query?.chip?? '';
    let preDate = req.body.query?.preDate?? '';
    let aftDate = req.body.query?.aftDate?? '';
    let target = req.body.query?.target?? '';
    let text = req.body.query?.text?? '';

    db.query(`CALL sheter_p_anm_prtc_lists('${spc}',${region},'${st}','${sex}','${ntr}','${chip}','${preDate}','${aftDate}','${target}','${text}',${queryNo},${rowMax});`, (error, rows, fields) =>{
        if (error) throw error;
        res.send({"totalCount" : rows[0][0].totalCount,"lists":rows[1]});
    });
})

// 보호 게시글 확인
app.get("/data/protection/:id", (req,res)=>{
    const id = req.params.id;
    if(id) {
        db.query('SELECT POST_NO AS postNo, USER_ID AS userId, USER_NO AS userNo, USER_PHONE AS userPhone, POST_ST_SUB AS stSub, ' +
            'DATE_FORMAT (CAST( POST_REG_YMD AS date),\'%Y-%m-%d\') AS rDate, DATE_FORMAT (CAST( POST_UDT_YMD AS date),\'%Y-%m-%d\') AS uDate, ' +
            'DATE_FORMAT (CAST( ANM_RSC_YMD AS date),\'%Y-%m-%d\') AS cDate, DATE_FORMAT (CAST( ANM_STAY_YMD AS date),\'%Y-%m-%d\') AS sDate, ' +
            'POST_MEMO AS memo, ANM_SPC AS spc, ANM_SPC_SUB AS spcSub, ANM_REGION AS region, ANM_REGION_SUB AS regionSub, ANM_NM AS name, ' +
            'ANM_SEX AS sex, ANM_NEUTERING_ST AS ntr, ANM_CHIP_ST AS chip, ANM_COLOR AS color, ANM_WEIGHT AS weight, ' +
            'ANM_BIRTH_YEAR AS bYear, ANM_BIRTH_MONTH AS bMonth, ANM_AGE_UNKNOWN AS ageUnknown, ANM_FEATURE AS feature, POST_VCNT AS vcnt, ' +
            'POST_PHOTO_URL AS photoUrl, POST_PHOTO_THUMB AS photoThumb, ANM_NM AS name, ANM_COLOR AS color, ANM_FEATURE AS feature ' +
            'FROM master_anm_post_db WHERE POST_NO=?',id, (error, rows, fields) =>{
            if (error) throw error;
            res.send(rows);
        });
    }else{
        res.send('There is no id.');
    }
})


// 보호 게시글 삭제
app.delete('/data/protection/:id', (req, res) =>{
    const id = req.params.id;
    console.log('(server)지울 no',id);

    if(id) {
        db.query('DELETE FROM master_anm_post_db WHERE post_no=?', id, (error, rows, fields) =>{
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
        res.send('There is no id.');
    }
})

//보호 조회수+
app.put('/data/protection/vcnt',(req,res) =>{
    const id = req.body.postNo;
    if(id) {
        db.query('UPDATE master_anm_post_db SET POST_VCNT = POST_VCNT+1 WHERE POST_NO=?',id,(err,rows) =>{
            if (err) {
                console.error("(server)조회수 추가 중 에러:", err);
                res.status(500).send("조회수 추가 중 에러가 발생했습니다.");
                return;
            }
            res.send(rows);
        })
    }else{
        res.send('There is no id.');
    }
})

//보호 게시글 등록
app.put("/data/protection", (req,res) =>{
    const {
        USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
    const values = [
        USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE];
    db.query(
        'INSERT INTO master_anm_post_db(POST_ST,' +
        'USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,' +
        'ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,' +
        'ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE) values (2,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',values, (error, rows, fields) =>{
        if (error) {
            console.error("(server)보호글 등록 중 에러:", error);
            res.status(500).send("보호글을 등록하는 도중 에러가 발생했습니다.");
        }else{
            res.send({ insertedId: res.insertId });
        }
    });
})

//보호 게시글 수정
app.put("/data/protection/:id", (req,res) =>{
    const id = req.params.id;
    if(id) {
        const {
            USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_UDT_YMD,ANM_RSC_YMD,
            ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
            ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
        const values = [
            USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_UDT_YMD,ANM_RSC_YMD,
            ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
            ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE];
        db.query(
            'UPDATE master_anm_post_db SET ' +
            'USER_NO=?,USER_ID=?,POST_ST_SUB=?,POST_MEMO=?,POST_PHOTO_URL=?,POST_PHOTO_THUMB=?,' +
            'POST_UDT_YMD=?,ANM_RSC_YMD=?,ANM_STAY_YMD=?,ANM_SPC=?,ANM_SPC_SUB=?,ANM_REGION=?,ANM_REGION_SUB=?,' +
            'ANM_SEX=?,ANM_NEUTERING_ST=?,ANM_CHIP_ST=?,ANM_WEIGHT=?,ANM_BIRTH_YEAR=?,ANM_BIRTH_MONTH=?,ANM_AGE_UNKNOWN=?,' +
            'ANM_NM=?,ANM_COLOR=?,ANM_FEATURE=? '  +
            `WHERE POST_NO=${id}`,values, (error, rows, fields) =>{
                if (error) {
                    console.error("(server)보호글 등록 중 에러:", error);
                    res.status(500).send("보호글을 등록하는 도중 에러가 발생했습니다.");
                }else{
                    res.send({ insertedId: res.insertId });
                }
            });
    }else{
        res.send('There is no id.');
    }
})

//실종 모든 게시글 수
app.get("/data/missing/tcnt", (req, res) =>{
    db.query('SELECT COUNT(*) AS cnt FROM master_anm_post_db WHERE POST_ST = 1', (error, tcnt) =>{
        if (error) throw error;
        res.send(tcnt);
    })
})

//실종 모든 게시글
app.post('/data/missing',(req,res) =>{
    const rowMax = Number(req.body.rowMax) > 0 ? Number(req.body.rowMax) : 10;
    const pageNo = Number(req.body.pageNo) > 0 ? Number(req.body.pageNo) : 1;
    const queryNo = (pageNo-1)*rowMax;

    let stSub = '';
    if(req.query.stSub){
        switch (req.query.stSub){
            case 'lost': stSub = 'a'; break;
            case 'see': stSub = 'b'; break;
            default: stSub='';
        }
    }
    let region = req.body.query?.region?? 0;
    let spc = req.body.query?.spc?? '';
    let sex = req.body.query?.sex?? '';
    let ntr = req.body.query?.ntr?? '';
    let chip = req.body.query?.chip?? '';
    let preDate = req.body.query?.preDate?? '';
    let aftDate = req.body.query?.aftDate?? '';
    let target = req.body.query?.target?? '';
    let text = req.body.query?.text?? '';

    db.query(`CALL sheter_p_anm_miss_lists('${spc}','${region}','${stSub}','${sex}','${ntr}','${chip}','${preDate}','${aftDate}','${target}','${text}',${queryNo},${rowMax});`, (error, rows, fields) =>{
        if (error) throw error;
        res.send({"totalCount" : rows[0][0].totalCount,"lists":rows[1]});
    });
})

// 실종 게시글 확인
app.get("/data/missing/:id", (req,res)=>{
    const id = req.params.id;
    if(id) {
        db.query('SELECT POST_NO AS postNo, USER_ID AS userId, USER_NO AS userNo, USER_PHONE AS userPhone, POST_ST_SUB AS stSub, ' +
            'DATE_FORMAT (CAST( POST_REG_YMD AS date),\'%Y-%m-%d\') AS rDate, DATE_FORMAT (CAST( POST_UDT_YMD AS date),\'%Y-%m-%d\') AS uDate, ' +
            'DATE_FORMAT (CAST( ANM_RSC_YMD AS date),\'%Y-%m-%d\') AS cDate, DATE_FORMAT (CAST( ANM_STAY_YMD AS date),\'%Y-%m-%d\') AS sDate, ' +
            'POST_MEMO AS memo, ANM_SPC AS spc, ANM_SPC_SUB AS spcSub, ANM_REGION AS region, ANM_REGION_SUB AS regionSub, ANM_NM AS name, ' +
            'ANM_SEX AS sex, ANM_NEUTERING_ST AS ntr, ANM_CHIP_ST AS chip, ANM_COLOR AS color, ANM_WEIGHT AS weight, ' +
            'ANM_BIRTH_YEAR AS bYear, ANM_BIRTH_MONTH AS bMonth, ANM_AGE_UNKNOWN AS ageUnknown, ANM_WEIGHT_UNKNOWN AS weightUnknown, ANM_FEATURE AS feature, POST_VCNT AS vcnt, ' +
            'POST_PHOTO_URL AS photoUrl, POST_PHOTO_THUMB AS photoThumb, ANM_NM AS name, ANM_COLOR AS color, ANM_FEATURE AS feature ' +
            'FROM master_anm_post_db WHERE POST_NO=?',id, (error, rows, fields) =>{
            if (error) throw error;
            res.send(rows);
        });
    }else{
        res.send('There is no id.');
    }
})


// 실종 게시글 삭제
app.delete('/data/missing/:id', (req, res) =>{
    const id = req.params.id;
    console.log('(server)지울 no',id);

    if(id) {
        db.query('DELETE FROM master_anm_post_db WHERE post_no=?', id, (error, rows, fields) =>{
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
        res.send('There is no id.');
    }
})

//실종 조회수+
app.put('/data/missing/vcnt',(req,res) =>{
    const id = req.body.postNo;
    if(id) {
        db.query('UPDATE master_anm_post_db SET POST_VCNT = POST_VCNT+1 WHERE POST_NO=?',id,(err,rows) =>{
            if (err) {
                console.error("(server)조회수 추가 중 에러:", err);
                res.status(500).send("조회수 추가 중 에러가 발생했습니다.");
                return;
            }
            res.send(rows);
        })
    }else{
        res.send('There is no id.');
    }
})

//실종 게시글 등록
app.put("/data/missing", (req,res) =>{
    const {
        USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_WEIGHT_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
    const values = [
        USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_WEIGHT_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE];
    db.query(
        'INSERT INTO master_anm_post_db(POST_ST,' +
        'USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,' +
        'ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,' +
        'ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_WEIGHT_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE) values (1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',values, (error, rows, fields) =>{
            if (error) {
                console.error("(server)실종글 등록 중 에러:", error);
                res.status(500).send("실종글을 등록하는 도중 에러가 발생했습니다.");
            }else{
                res.send({ insertedId: res.insertId });
            }
        });
})

//실종 게시글 수정
app.put("/data/missing/:id", (req,res) =>{
    const id = req.params.id;
    if(id) {
        const {
            USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_UDT_YMD,ANM_RSC_YMD,
            ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
            ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
        const values = [
            USER_NO,USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_UDT_YMD,ANM_RSC_YMD,
            ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
            ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE];
        db.query(
            'UPDATE master_anm_post_db SET ' +
            'USER_NO=?,USER_ID=?,POST_ST_SUB=?,POST_MEMO=?,POST_PHOTO_URL=?,POST_PHOTO_THUMB=?,' +
            'POST_UDT_YMD=?,ANM_RSC_YMD=?,ANM_STAY_YMD=?,ANM_SPC=?,ANM_SPC_SUB=?,ANM_REGION=?,ANM_REGION_SUB=?,' +
            'ANM_SEX=?,ANM_NEUTERING_ST=?,ANM_CHIP_ST=?,ANM_WEIGHT=?,ANM_BIRTH_YEAR=?,ANM_BIRTH_MONTH=?,ANM_AGE_UNKNOWN=?,' +
            'ANM_NM=?,ANM_COLOR=?,ANM_FEATURE=? '  +
            `WHERE POST_NO=${id}`,values, (error, rows, fields) =>{
                if (error) {
                    console.error("(server)실종글 등록 중 에러:", error);
                    res.status(500).send("실종글을 등록하는 도중 에러가 발생했습니다.");
                }else{
                    res.send({ insertedId: res.insertId });
                }
            });
    }else{
        res.send('There is no id.');
    }
})
//입양 후기 리스트 조회
app.post("/data/adoption/review", (req,res) =>{
    const rowMax = Number(req.body.rowMax) > 0 ? Number(req.body.rowMax) : 10;
    const pageNo = Number(req.body.pageNo) > 0 ? Number(req.body.pageNo) : 1;
    const queryNo = (pageNo-1)*rowMax;

    let st = req.body.query?.reviewType?? '';
    let target = req.body.query?.target?? '';
    let text = req.body.query?.text?? '';

    db.query(`CALL sheter_p_adopt_review_list('${st}','${target}','${text}',${queryNo},${rowMax})`,  (error, rows) =>{
        if (error) throw error;
        res.send({"totalCount" : rows[0][0].totalCount,"lists":rows[1]});
    });
})


//입양 탭 조회
app.get("/data/adoption/tab",(req,res) => {
    const sql = 'select ADOPT_NO AS no, ADOPT_TITLE AS title, ADOPT_CONTENTS as contents, ADOPT_TAB_ORDER as tabOrder from master_adopt_tab_db order by ADOPT_TAB_ORDER;';
    db.query(sql, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 탭 순서 변경
app.put('/data/adoption/tab/order/:id',(req, res)=>{
    const id = req.params.id;
    const orderNo = req.body.orderNo;
    db.query('UPDATE master_adopt_tab_db SET ADOPT_TAB_ORDER=? WHERE ADOPT_NO=?;',[orderNo, id], (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 탭 등록
app.post('/data/adoption/tab', (req, res) =>{
    const id = req.params.id;
    const {title, contents, userNo, userId, regDate, udtDate, orderNo} = req.body;
    const values = [title, contents, userNo, userId, regDate, udtDate, orderNo];
    db.query('INSERT INTO master_adopt_tab_db(ADOPT_TITLE, ADOPT_CONTENTS, USER_NO, USER_ID, ADOPT_REG_YMD, ADOPT_UDT_YMD, ADOPT_TAB_ORDER) values (?,?,?,?,?,?,?);',
        values, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 탭 정보 수정
app.put('/data/adoption/tab/:id',(req, res)=>{
    const id = req.params.id;
    const {title, contents, userNo, userId, udtDate} = req.body;
    const values = [title, contents, userNo, userId, udtDate,id];
    db.query('UPDATE master_adopt_tab_db SET ADOPT_TITLE=?,ADOPT_CONTENTS=?,USER_NO=?,USER_ID=?,ADOPT_UDT_YMD=? WHERE ADOPT_NO=?',values, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 단일 탭 정보 조회
app.get("/data/adoption/tab/:id",(req,res) => {
    const id = req.params.id;
    db.query('select ADOPT_NO AS no, ADOPT_TITLE AS title, ADOPT_CONTENTS as contents, ADOPT_REG_YMD AS regDate, ADOPT_UDT_YMD AS udtDate, USER_ID AS userId from master_adopt_tab_db where ADOPT_NO=?',id, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 탭 삭제
app.delete("/data/adoption/tab/:id",(req,res) => {
    const id = req.params.id;
    db.query('DELETE FROM master_adopt_tab_db WHERE ADOPT_NO=?;',id, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})
