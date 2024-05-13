import board from "../../js/board.jsx";
import {useEffect} from "react";

function View(props) {
    console.log("view props:", props)
    const isUdmin = true;

    const update = () =>{
        props.changeEditable({"editable" : true, "type" : 2});
    }

    const remove = () =>{
        if(window.confirm('정말로 해당 공지사항을 삭제하시겠습니까?')){
            board.remove('notice', props.data.at(0)?.ntcNo).then((res)=>{
                if(res.status === 200){
                    alert('공지사항이 삭제되었습니다');
                    props.changeVisible({visible : false , ntcNo : 0});
                }else{
                    alert('삭제실패여요');
                }
            })
        }
    }

    const undo = ()=>{
        props.changeVisible({visible : false , ntcNo : 0})
    }


    return(
        <>
            <div>
                <span>(제목){props.data.at(0)?.title}</span>
                <span>(작성자ID){props.data.at(0)?.userId}</span>
                <span>(등록일){props.data.at(0)?.date}</span>
            </div>
            <div>(내용){props.data.at(0)?.contents}</div>
            <div>
                {isUdmin &&
                    <>
                        <button onClick={update}>수정</button>
                        <button onClick={remove}>삭제</button>
                    </>
                }
                <button onClick={undo}>돌아가기</button>
            </div>
        </>
    )
}

export default View;