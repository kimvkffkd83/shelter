import express from "express";
import jwt from "jsonwebtoken";
import {expressjwt} from "express-jwt";
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'
import bcrypt from "bcrypt";

const app = express();
const port = 4000 //기본 포트 3000에서 변경해주기
const salt = 5;
const secretKey = 'shake-it-off-3000';
const refreshTokenSecret = 'rock-will:naver-die';
const refreshTokens = [];

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

//유저 회원가입 시 아이디 중복 체크
app.get('/chkIdDuplication/:id',(req, res)=>{
    const id = req.params.id;
    //중복이 있으면 1, 없으면 0
    db.query(
        'select\n' +
        '    case\n' +
        '        when count(*) > 0 THEN 1\n' +
        '        ELSE 0\n' +
        '        END AS result\n' +
        'from master_user_db where USER_ID=?;',id, (error, rows) =>{
            if (error) {
                console.error("(server)아이디 중복 체크 중 에러:", error);
                res.status(500).send(")아이디 중복 체크 중 에러가 발생했습니다.");
                return;
            }else{
                res.send(rows);
            }
        }
    )
})

//유저 회원 가입
app.post('/nSignUp',async (req, res) =>{
    //프로시저 내에서 중복 데이터 막기
    const {name, id, pw, phone, mail} = req.body;

    //비밀번호 암호화
    const hashedPw = await bcrypt.hash(pw, salt);
    const values = [id, hashedPw, name, phone, mail];

    db.query(
        'CALL sheter_p_user_normal_sign_up(?,?,?,?,?)',values,(error, rows) =>{
            if (error) {
                if(error.sqlState === '23000'){
                    res.status(409).send(`아이디 혹은 이메일에 중복이 발생했습니다.`);
                    return;
                }else{
                    res.status(500).send(`봉사활동을 신청하는 도중 에러가 발생했습니다.`);
                    return;
                }
            }else{
                //수정 사항 rows 말고 단일 값으로 보낼 것
                res.send(rows);
            }
        }
    )
})

//유저 로그인
app.post('/nLogin',async (req, res) =>{
    //프로시저 내에서 중복 데이터 막기
    const {id, pw} = req.body;

    db.query('select USER_PW, USER_ST, USER_NM from master_user_db where USER_ID = ?;',id, async (error, rows) =>{
            if (error) {
                console.log(error);
                res.status(500).send(`로그인 중 에러가 발생했습니다.`);
                return;
            }else{
                if(rows.length === 0){
                    //회원가입 안된 경우 401
                    console.log('아이디 없음')
                    res.status(401).send(`등록되지 않은 회원입니다.`);
                    return;
                }else{
                    const user = rows[0];
                    const isMatch = await bcrypt.compare(pw, user.USER_PW);
                    if(isMatch){
                        //올바른 로그인
                        const token =
                            jwt.sign({
                                userId: id,
                                userSt: user.USER_ST,
                                userNm: user.USER_NM
                            }, secretKey, { expiresIn: '1h' });
                        const refreshToken = jwt.sign({
                            userId: user._id,
                            userSt: user.USER_ST,
                            userNm: user.USER_NM
                            }, refreshTokenSecret);
                        refreshTokens.push(refreshToken);
                        res.send({ token,refreshToken });
                    }else{
                        //아이디는 일치하나 비밀번호가 틀린 경우 401
                        console.log('비번 틀림')
                        res.status(401).send(`등록되지 않은 회원입니다.`);
                        return;
                    }
                }
            }
        }
    )
})
//토큰이 유효한지 확인
app.get('/validToken',(req, res) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if(token){
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('Invalid token');
            }
            return res.send({token})
        })
    }
})

//토큰 갱신
app.post('/token', (req, res) =>{
    const {token} = req.body;
    if (!token) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const newToken = jwt.sign({
            userId: user.userId,
            userSt: user.USER_ST,
            userNm: user.USER_NM
        }, secretKey, { expiresIn: '1h' });
        res.send({ token: newToken });
    });
})

const getNoFromId = (id)=>{
    return new Promise((resolve, reject) => {
        db.query('SELECT USER_NO FROM master_user_db WHERE USER_ID = ?', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].USER_NO);
                } else {
                    resolve(-1);
                }
            }
        });
    });
}

const getUserSt = (token) =>{
    // 0이면 어드민, 1이면 정회원
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                resolve(1);
            }else{
                resolve(decoded.userSt);
            }
        })
    });
}


app.use('/authorized', expressjwt({ secret: secretKey, algorithms: ['HS256'] }));

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

app.get("/data/main/:board/list",(req,res) =>{
    const board = req.params.board;
    db.query('CALL sheter_p_main_board_list(?,6)', board,(error, rows) =>{
        if (error) {
            console.error(`(server) ${board} 목록 조회 중 에러:`, error);
            res.status(500).send(`${board} 목록을 조회하는 도중 에러가 발생했습니다.`);
            return;
        }
        res.send(rows);
    });
})

// //공지사항 모든 게시글 수
// app.get("/data/notice/tcnt", (req, res) =>{
//     db.query('SELECT COUNT(*) AS cnt FROM master_notice_db', (error, tcnt) =>{
//         if (error) throw error;
//         res.send(tcnt);
//     })
// })

//공지사항 최신 1페이지 조회
app.get("/data/notice",async (req,res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let userSt = -1;

    if(token){
        userSt = await getUserSt(token);
    }

    console.log("userSt",userSt);

    const rowMax = 10;
    const pageNo =  req.query?.pageNo?? 1;
    const queryNo = (pageNo-1)*rowMax;
    db.query('CALL sheter_p_notice_list(?,?,?)',[userSt, queryNo, rowMax], (error, rows, fields) =>{
        if (error) {
            return res.status(500).send('공지사항 목록을 조회하는 중 오류가 발생했습니다.');
        } else{
            return res.send({"totalCount" : rows[0][0].totalCount,"lists":rows[1]});
        }
    });
})

//공지사항 게시글 등록
app.post("/data/notice", async (req,res) =>{
    const {USER_ID, NTC_TITLE, NTC_CONTENTS, NTC_REG_DATE, NTC_UDT_DATE} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

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
        db.query('SELECT POST_NO AS postNo, ANM_SERIAL_NO AS serialNo, USER_ID AS userId, USER_NO AS userNo, USER_PHONE AS userPhone, POST_ST_SUB AS stSub, ' +
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
app.put("/data/protection", async (req,res) =>{
    const {
        USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

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
        db.query('SELECT POST_NO AS postNo, ANM_SERIAL_NO AS serialNo, USER_ID AS userId, USER_NO AS userNo, USER_PHONE AS userPhone, POST_ST_SUB AS stSub, ' +
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
app.put("/data/missing", async (req,res) =>{
    const {
        USER_ID,POST_ST_SUB,POST_MEMO,POST_PHOTO_URL,POST_PHOTO_THUMB,POST_REG_YMD,POST_UDT_YMD,ANM_RSC_YMD,
        ANM_STAY_YMD,ANM_SPC,ANM_SPC_SUB,ANM_REGION,ANM_REGION_SUB,ANM_SEX,ANM_NEUTERING_ST,ANM_CHIP_ST,ANM_WEIGHT,
        ANM_BIRTH_YEAR,ANM_BIRTH_MONTH,ANM_AGE_UNKNOWN,ANM_WEIGHT_UNKNOWN,ANM_NM,ANM_COLOR,ANM_FEATURE} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

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

//입양 신청 하기
app.post("/data/adoption", async (req, res) =>{
    const {USER_ID,USER_NM,USER_CALL,USER_MAIL,APP_TITLE,APP_CONTENTS,APP_REG_YMD,APP_UDT_YMD,APP_ATTACH,APP_TYPE,ANM_SPC,ANM_SERIAL_NO} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

    const APP_ST = 'a';
    const values = [USER_NO,USER_ID,USER_NM,USER_CALL,USER_MAIL,APP_TITLE,APP_CONTENTS,APP_REG_YMD,APP_UDT_YMD,APP_ATTACH,APP_TYPE,ANM_SPC,ANM_SERIAL_NO,APP_ST];
    db.query(
        'INSERT INTO master_adopt_db(USER_NO,USER_ID,USER_NM,USER_CALL,USER_MAIL,APP_TITLE,APP_CONTENTS,APP_REG_YMD,APP_UDT_YMD,APP_ATTACH,APP_TYPE,ANM_SPC,ANM_SERIAL_NO,APP_ST) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',values, (error, rows, fields) =>{
            if (error) {
                console.error("(server)입양 신청 등록 중 에러:", error);
                res.status(500).send("입양 신청을 등록하는 도중 에러가 발생했습니다.");
            }else{
                res.send({ insertedId: res.insertId });
            }
        });
})

//로그인한 회원이 신청한 입양 신청 리스트 보기
app.get("/data/adoption", (req, res) =>{
    const token = req.headers.authorization?.split(' ')[1];
    let id = '';
    if(token){
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                //로그인 정보가 유효하지 않음
                //어케 해줄거? 추가 조치 필요
                res.send({"totalCount" : 0,"lists":[]});
                return;
            }else{
                id = decoded.userId;
                db.query('CALL shelter_p_adopt_list(?)',id, (error, rows) =>{
                    if (error) {
                        console.error("(server)입양 신청 리스트 조회 중 에러:", error);
                        res.status(500).send("입양 신청 리스트를 조회 중 에러가 발생했습니다.");
                    }else{
                        console.log(rows);
                        res.send({"totalCount" : rows[0][0].totalCount,"lists":rows[1]});
                    }
                })
            }
        })
    }else{
        res.send({"totalCount" : 0,"lists":[]});
    }
})

//입양 후기 리스트 조회
app.post("/data/adoption/review/list", (req,res) =>{
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

//입양 후기 작성
app.post("/data/adoption/review", async (req,res) =>{
    const {USER_ID,POST_TITLE,POST_CONTENTS,POST_REG_DATE,POST_UDT_DATE} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

    console.log("??",USER_NO)
    const values = [USER_NO,USER_ID,POST_TITLE,POST_CONTENTS,POST_REG_DATE,POST_UDT_DATE];
    db.query(
        'INSERT INTO master_adopt_review_db(USER_NO,USER_ID,ADOPT_POST_TITLE,ADOPT_POST_CONTENTS,ADOPT_REG_YMD,ADOPT_UDT_YMD) values (?,?,?,?,?,?)',values, (error, rows, fields) =>{
            if (error) {
                console.error("(server)입양 후기 글 등록 중 에러:", error);
                res.status(500).send("입양 후기 글을 등록하는 도중 에러가 발생했습니다.");
            }else{
                res.send({ insertedId: res.insertId });
            }
        });
})

//입양 후기 단일 뷰 조회
app.get("/data/adoption/review/:id",(req,res) => {
    const id = req.params.id;
    db.query('select ADOPT_POST_NO AS no, ADOPT_POST_TITLE AS title, ADOPT_POST_CONTENTS as contents, DATE_FORMAT (CAST( ADOPT_REG_YMD AS date),\'%Y-%m-%d\') AS regDate, DATE_FORMAT (CAST( ADOPT_UDT_YMD AS date),\'%Y-%m-%d\') AS udtDate, USER_ID AS userId from master_adopt_review_db where ADOPT_POST_NO=?',id, (error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//입양 후기 조회수+
app.put('/data/adoption/review/vcnt',(req,res) =>{
    const id = req.body.no;
    if(id) {
        db.query('UPDATE master_adopt_review_db SET ADOPT_POST_VCNT = ADOPT_POST_VCNT+1 WHERE ADOPT_POST_NO=?',id,(err,rows) =>{
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

//입양 탭 조회
app.get("/data/adoption/tab/list",(req,res) => {
    db.query('select ADOPT_NO AS no, ADOPT_TITLE AS title, ADOPT_CONTENTS as contents, ADOPT_TAB_ORDER as tabOrder from master_adopt_tab_db order by ADOPT_TAB_ORDER;', (error, rows) =>{
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
app.post('/data/adoption/tab', async (req, res) =>{
    const {title, contents, userId, regDate, udtDate, orderNo} = req.body;
    const userNo = await getNoFromId(userId);

    if(userNo < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

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





//봉사 신청 가능한 봉사활동 전체 리스트
app.get("/data/volunteer",(req,res) => {
    db.query('SELECT timeDB.TIME_NO as tNo, timeDB.SSN_NO as sNo, timeDB.TIME_DATE_YMD as time, timeDB.TIME_ST AS tSt, \n' +
        'timeDB.TIME_OPEN tOpen, timeDB.TIME_MAX_CNT as maxCnt, timeDB.TIME_NOW_CNT as nowCnt, ssnDB.SSN_TITLE AS title \n' +
        'FROM master_volunteer_time_db timeDB LEFT OUTER JOIN master_volunteer_session_db ssnDB ON timeDB.SSN_NO = ssnDB.SSN_NO \n' +
        'WHERE TIME_OPEN = 1;\n',(error, rows) =>{
        if (error) throw error;
        res.send(rows);
    });
})

//봉사 해당 날짜에 신청가능한 봉사활동 리스트
//추후 프로시저로 변경해서 지원자 목록까지 추가할 것
app.get("/data/volunteer/:date",(req,res) => {
    const date = req.params.date;
    db.query('CALL sheter_p_volunteer_list(?)',date,(error, rows) =>{
        if (error) throw error;
        res.send({"ableList":rows[0],"regList":rows[1]});
    });
})

//봉사 특정날짜 봉사 신청하기
app.post("/data/volunteer/apply", async (req,res) =>{
    const {USER_ID,TIME_NO,SSN_NO,USER_NM,USER_CALL,RSV_YMD,REG_YMD} = req.body;
    const USER_NO = await getNoFromId(USER_ID);

    console.log("USER_NO",USER_NO);

    if(USER_NO < 0){
        res.status(401).send(`등록되지 않은 회원입니다.`);
        return;
    }

    const values = [USER_NO,USER_ID,TIME_NO,SSN_NO,USER_NM,USER_CALL,RSV_YMD,REG_YMD];
    db.query('CALL sheter_p_volunteer_apply(?,?,?,?,?,?,?,?)',values,(error, rows) =>{
        if (error) {
            if(error.sqlState === '45000'){
                res.status(409).send(`해당 날짜에 더 이상 신청할 수 있는 봉사활동이 없습니다.`);
                return;
            }else{
                res.status(500).send(`봉사활동을 신청하는 도중 에러가 발생했습니다.`);
                return;
            }
        }
        res.send(rows);
    });
})

//봉사 특정날짜에 신청 가능한지 미리 체크
app.post("/data/volunteer/chk",(req,res)=>{
    const {RSV_YMD, USER_NO, TIME_NO} = req.body;
    const values = [RSV_YMD, USER_NO, TIME_NO];
    db.query(
        'SELECT CASE\n' +
        '           WHEN SUM(cnt) > 0 THEN 0\n' +
        '           ELSE 1\n' +
        '           END AS result\n' +
        'FROM (\n' +
        '         SELECT COUNT(*) AS cnt\n' +
        '         FROM master_volunteer_reservation_db\n' +
        '         WHERE RSV_DATE_YMD = ? AND USER_NO = ?\n' +
        '\n' +
        '         UNION ALL\n' +
        '\n' +
        '         SELECT COUNT(*) AS cnt\n' +
        '         FROM master_volunteer_time_db\n' +
        '         WHERE TIME_NO = ? AND TIME_NOW_CNT = TIME_MAX_CNT\n' +
        '     ) AS combined_counts;',values,(error, rows) =>{
            if (error) {
                console.error("(server)봉사활동 신청 가능 여부 체크 중 에러:", error);
                res.status(500).send("공지사항을 등록하는 도중 에러가 발생했습니다.");
                return;
            }else{
                res.send(rows);
            }
    })
})