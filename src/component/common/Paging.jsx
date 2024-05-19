import {useEffect, useState} from "react";

function Paging(props){
    //페이지네이션 자체 값 (블럭 수)
    const BLOCK_MAX = 10;
    const ROW_MAX = 10;

    //페이징 파라미터
    const {pageNo, totalRows}= props;


    //자체값과 파라미터로 계산하는 값들
    const [blockCnt, setBlockCnt] = useState(1)
    const [blockNow, setBlockNow] = useState(1);
    const [numBtns , setNumBtns] = useState([])


    useEffect(() => {
        //계산
        if(totalRows%ROW_MAX === 0){
            setBlockCnt(Math.min(totalRows/ROW_MAX, BLOCK_MAX));
        }else{
            setBlockCnt(Math.min((Math.floor(totalRows/ROW_MAX)+1), BLOCK_MAX));
        }
    }, []);


    return(
        <div className="page__btns">

        </div>
    )

}

export default Paging;