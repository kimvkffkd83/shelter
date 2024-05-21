import {useEffect, useState} from "react";

function Paging(props){
    //페이지네이션 자체 값 (블럭 수)
    const ROW_MAX = 10; //한 페이지에 뿌릴 데이터 수
    const BLOCK_MAX = 10; //한 번들의 최대 버튼 개수

    //페이징 파라미터
    const {pageNo, changePage, totalRows}= props;

    //자체값과 파라미터로 계산하는 값들
    const [pageCnt, setPageCnt] = useState(1)
    const [bundleCnt, setBundleCnt] = useState(1); //번들 총 개수
    const [bundleNo, setBundleNo] = useState(1); //현재 번들 위치
    const [numBtns , setNumBtns] = useState([]); //숫자버튼

    // n부터 1씩 증가하여 length개 인자를 가지는 배열 만드는 메소드
    const makeArray = (init, length)=>{
        return Array.from({ length: length }, (_, i) => init + i);
    }

    //전체 data 개수를 알면 필요한 페이지 수와 번들 수를 구할 수 있음
    useEffect(() => {
        //총 페이지 수
        let pc = Math.ceil(totalRows/ROW_MAX);
        setPageCnt(pc);
        setBundleCnt(Math.ceil(pc/BLOCK_MAX));
    }, [totalRows]);

    useEffect(()=>{
        //번들 계산
        let init = 10*bundleNo-9;
        let end = pageCnt > 10 * bundleNo ? 10 : pageCnt % 10;

        setNumBtns(makeArray(init, end));
    },[pageCnt,bundleNo])

    const paging = (e)=>{
        changePage(Number(e.target.innerText));
    }
    const prev = ()=>{
        if(bundleNo > 1){
            const to = bundleNo-1;
            setBundleNo(to);
            changePage(10*to-9);
        }
    }

    const next = ()=>{
        if(bundleNo < bundleCnt){
            const to = bundleNo+1;
            setBundleNo(to);
            changePage(10*to-9);
        }
    }

    return(
        <div className="page__btns">
            <button onClick={prev} className={bundleNo > 1 ? "btn__page__default btn__pa_arrow" : "btn__page__default btn__page__arrow-disabled"}>
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {
                numBtns.map((btn, idx) => (
                    <button key={idx} onClick={paging}
                            className={pageNo === btn ? 'btn__page__default btn__page__select' : 'btn__page__default btn__page__default'}>{btn}</button>
                ))
            }
            <button onClick={next} className={bundleNo < bundleCnt ? "btn__page__default btn__page__arrow" : "btn__page__default btn__page__arrow-disabled"}>
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    )

}

export default Paging;