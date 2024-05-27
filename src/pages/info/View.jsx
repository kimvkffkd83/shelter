import board from "../../api/Board.jsx";
import dp from "dompurify"

function View(props) {
    console.log("view props:", props)
    const isUdmin = true;

    const update = () =>{
        props.changeEditable({"editable" : true, "type" : 2});
    }

    const remove = () =>{
        if(window.confirm('정말로 해당 공지사항을 삭제하시겠습니까?')){
            board.remove(props.data.at(0)?.ntcNo).then((res)=>{
                console.log("delete res: ",res);
                if(res.status === 500 || res.status === 404 ){
                    alert(res.data);
                }else{
                    alert("삭제가 완료되었습니다.")
                    props.changeVisible({visible : false , ntcNo : 0});
                }
            })
        }
    }

    const undo = ()=>{
        props.changeVisible({visible : false , ntcNo : 0})
    }


    return(
        <>
            <div className="box__post">
                <div className="post__header">
                    <span className="post__title w80">{props.data.at(0)?.title}</span>
                    <span className="post__user-id w10 tc">{props.data.at(0)?.userId}</span>
                    <span className="post__date w10 tc">{props.data.at(0)?.date}</span>
                </div>
                <div className="post__content" dangerouslySetInnerHTML={{ __html: dp.sanitize(props.data.at(0)?.contents) }}>
                </div>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={undo}>목록으로</button>
            </div>
            {isUdmin &&
                <div className="box__adm">
                    <div className="box__adm__btns">
                        <button className="btn__adm" onClick={update}>수정</button>
                        <button className="btn__adm" onClick={remove}>삭제</button>
                    </div>
                </div>
            }
        </>
    )
}

export default View;