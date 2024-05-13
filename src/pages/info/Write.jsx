import axios from "axios";
import {useRef} from "react";

function Write(props){

    const titleRef = useRef()
    const contentsRef = useRef()

    const action = ()=>{
        writePost().then((res)=>{
            console.log(res);
            alert('공지사항이 등록되었습니다');
        }).then(()=>{
            props.changeEditable({"editable" : false, "type" : 0});
        })

    }
    const writePost  = async ()=>{
        const date = new Date();
        const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+ date.getDate().toString().padStart(2, '0');

        const data = {
            "user_no" : 1,
            "user_id" : 'se6651',
            "ntc_title" : titleRef.current.value,
            "ntc_contents" : contentsRef.current.value,
            "ntc_reg_date" : newDate,
            "ntc_udt_date" : newDate,
        }

        console.log("data",data);
        try {
            return await axios.post('http://localhost:4000/data/notice/write', data);
        } catch (err){
            console.log(err);
        }
    }
    const undo = ()=>{
        props.changeEditable({"editable" : false, "type" : 0})
    }

    return(
        <>
            <ul>
                <li>
                    <div>
                        <span>제목 : </span>
                    </div>
                    <div>
                        <input className="title" ref={titleRef}/>
                    </div>
                </li>
                <li>
                    <div>
                        <span>날짜 : </span>
                    </div>
                    <div>
                        <label htmlFor="date">현재</label>
                        <input className="date" type="radio"></input>
                         <label htmlFor="date">예약</label>
                        <input className="date" type="radio"></input>
                    </div>
                    <div>
                        날짜 라이브러리
                    </div>
                </li>
                <li>
                    <div>
                        <span>내용 : </span>
                    </div>
                    <div>
                        <textarea ref={contentsRef}/>
                    </div>

                </li>
            </ul>
            <div>
                <button onClick={action}>{props.data.type === 1 ? '등록' : '수정'}</button>
                <button onClick={undo}>취소</button>
            </div>
        </>
    )
}

export default Write;