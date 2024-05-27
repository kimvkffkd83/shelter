import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import {randomUUID} from "crypto";

const app = express();
const port = 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: 5000000, extended:false, parameterLimit:1000000}));
app.use(bodyParser.json({limit: 5000000}));
//정적 파일 위치 설정
app.use(express.static(path.join(__dirname, 'public','img','uploads')));

const upload = multer({
    //저장소 설정 -> 디스크에 할 지 메모리에 할 지 선택 가능
    storage: multer.diskStorage({
        //저장할 위치
        destination(req,file,callback){
            callback(null,'public/img/uploads/notice');
        },
        //파일 명명 규칙
        filename(req, file, callback){
            console.log("file",file)
            const uuid = randomUUID();
            const ext = path.extname(file.originalname);
            callback(null, path.basename(file.originalname,ext) + uuid + ext);
        }
    }),
    // 파일 크기 제한 설정
    limits : {
        files:10, fileSize:10000000
    }
})

app.listen(port, ()=>{
    console.log("포토 서버 개시 완료")
})

app.post('/img', upload.single("img"), (req,res) =>{
    console.log('전달받은 파일', req.file);
    console.log('저장된 파일의 이름', req.file.filename);

    // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    const IMG_URL = `http://localhost:5000/notice/${req.file.filename}`;
    console.log(IMG_URL);
    res.json({ url: IMG_URL });
})