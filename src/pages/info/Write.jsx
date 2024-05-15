import axios from "axios";
import {useEffect, useRef} from "react";
import board from "../../api/Board.jsx";

function Write(props){
    console.log("props:",props);
    // console.log("props:",props.post.at(0).title);

    const titleRef = useRef()
    const contentsRef = useRef()
    const date = new Date();
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const action = ()=>{
        const data = {
            "user_no" : 1,
            "user_id" : 'se6651',
            "ntc_title" : titleRef.current.value,
            "ntc_contents" : contentsRef.current.value,
            "ntc_reg_date" : props.data.type === 1 ? newDate : props.post.at(0).date.replaceAll('-',''),
            "ntc_udt_date" : newDate,
        }

        console.log("data:",data);

        if(props.data.type === 1){
            board.write(data).then((res)=>{
                console.log(res);
                if(res.status === 200){
                    alert('공지사항이 등록되었습니다');
                    props.changeEditable({"editable" : false, "type" : 0});
                }else{
                    alert('등록실패여요');
                }
            })
        }else if(props.data.type === 2){
            data.ntc_no = props.post.at(0)?.ntcNo;
            delete data.ntc_reg_date;
            board.update(props.post.at(0)?.ntcNo, data).then((res)=>{
                console.log(res);
                if(res.status === 200){
                    alert('공지사항이 수정되었습니다');
                    props.post.at(0).ntcNo = data.ntc_no;
                    props.post.at(0).userId = data.user_id;
                    props.post.at(0).title = data.ntc_title;
                    props.post.at(0).contents = data.ntc_contents;
                    props.post.at(0).date = newDateStr;
                    props.changeEditable({"editable" : false, "type" : 0});
                }else{
                    alert('수정실패여요');
                }
            })
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
                        <input className="title" ref={titleRef} defaultValue={props.post.at(0)?.title}/>
                    </div>
                </li>
                <li>
                    <div>
                        <span>날짜 : </span>
                    </div>
                    <div>
                        <span>{newDate}</span>
                        {props.data.type === 1 &&
                            <>
                                <div>
                                    <label htmlFor="date">현재</label>
                                    <input className="date" type="radio"></input>
                                    <label htmlFor="date">예약</label>
                                    <input className="date" type="radio"></input>
                                </div>
                                <div>
                                    날짜 라이브러리
                                </div>
                            </>
                        }
                    </div>
                </li>
                <li>
                <div>
                        <span>내용 : </span>
                    </div>
                    <div>
                        <textarea ref={contentsRef} defaultValue={props.post.at(0)?.contents}/>
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