import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../js/board.jsx';

function Notice() {
    const title = 'notice';
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);

    useEffect(() => {
        Board.getData(title).then((res)=> {
            setBoard(res.data);
        });
        Board.getCnt(title).then((res) =>{
            setTotalCnt(res.data[0].cnt);
        });
    }, []);

    return (
        <>
            <div>
                <span>전체 : {totalCnt} / 페이지수 : {1}</span>
            </div>
            <ul className="boardTable">
                <li>
                    <div className="table th">번호</div>
                    <div className="table th">제목</div>
                    <div className="table th">작성자</div>
                    <div className="table th">등록일</div>
                    <div className="table th">조회</div>
                </li>
                {
                    board.map((post, index)=>(
                        <li key={index}>
                            <div className="table tc">{index}</div>
                            <div className="table tc">{post.title}</div>
                            <div className="table tc">{post.userId}</div>
                            <div className="table tc">{post.date}</div>
                            <div className="table tc">{post.vcnt}</div>
                        </li>
                    ))
                }
            </ul>
            <div className="admin">
                <button>글쓰기</button>
                <button>수정</button>
                <button>삭제</button>
            </div>
        </>
    )
}

export default Notice;