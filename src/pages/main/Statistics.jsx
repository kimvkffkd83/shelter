import {useEffect, useState} from "react";
import Main from "../../api/Main.jsx";

const Statistics = () =>{
    const [list, setList] = useState();

    const getLists = ()=>{
        Main.statList().then((res)=>{
            setList(res);
            console.log(res);
        })
    }
    useEffect(()=>{
        getLists();
    },[])

    return(
        <>
            <div className="stat__title"></div>
            <hr />
            <div className="stat__contents">
                <div className="stat__item">
                    <div className="stat__item__title"></div>
                    <div className="stat__item__content">
                        <ul className="stat__item__ul">
                            <li className="stat__item__li"><strong>보호등록</strong>
                                <ul>
                                    <li>당월 {list?.prtc_m}건</li>
                                    <li>당일 {list?.prtc_t}건</li>
                                </ul>
                            </li>
                            <li className="stat__item__li"><strong>실종등록</strong>
                                <ul>
                                    <li>당월 {list?.miss_m}건</li>
                                    <li>당일 {list?.miss_t}건</li>
                                </ul>
                            </li>
                            <li className="stat__item__li"><strong>입양완료</strong>
                                <ul>
                                    <li>당월 {list?.adopt_m}건</li>
                                    <li>당일 {list?.adopt_t}건</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Statistics;