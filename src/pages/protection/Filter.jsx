import React, {useState} from "react";
import "../../css/Main.css"

function Filter() {
    const [viewSt, setViewSt] = useState(0);
    return (
        <div className="filter__content">
            <div className="filter__box">
                <div className="filter__item">
                    <label htmlFor="spc" className="filter__label">종류:</label>
                    <select name="spc" className="filter__select">
                        <option name="spc" value="">전체</option>
                        <option name="spc" value="dog">개</option>
                        <option name="spc" value="cat">고양이</option>
                        <option name="spc" value="etc">기타</option>
                    </select>
                </div>
                <div className="filter__item">
                    <label htmlFor="region" className="filter__label">지역:</label>
                    <select name="region" className="filter__select">
                        <option name="region" value="">전체</option>
                        <option name="region" value="1">동구</option>
                        <option name="region" value="2">서구</option>
                        <option name="region" value="3">남구</option>
                        <option name="region" value="4">북구</option>
                        <option name="region" value="5">광산구</option>
                    </select>
                </div>
                <div className="filter__item">
                    <label htmlFor="st" className="filter__label">상태:</label>
                    <select name="st" className="filter__select">
                        <option name="st" value="a">전체</option>
                        <option name="st" value="b">공고중</option>
                        <option name="st" value="c">입양가능</option>
                        <option name="st" value="d">입양예정</option>
                        <option name="st" value="e">귀가예정</option>
                        <option name="st" value="f">임시보호</option>
                        <option name="st" value="g">입양완료</option>
                        <option name="st" value="h">귀가</option>
                        <option name="st" value="i">기증</option>
                    </select>
                </div>
                <div className="filter__item">
                    <label htmlFor="set" className="filter__label">성별:</label>
                    <select name="set" className="filter__select">
                        <option name="sex" value="">전체</option>
                        <option name="sex" value="m">수컷</option>
                        <option name="sex" value="f">암컷</option>
                    </select>
                </div>
                <div className="filter__item">
                    <label htmlFor="neutering" className="filter__label">중성화:</label>
                    <select name="neutering" className="filter__select">
                        <option name="neutering" value="">전체</option>
                        <option name="neutering" value="y">유</option>
                        <option name="neutering" value="n">무</option>
                    </select>
                </div>
                <div className="filter__item">
                    <label htmlFor="chip" className="filter__label">내장칩:</label>
                    <select name="chip" className="filter__select">
                        <option name="chip" value="">전체</option>
                        <option name="chip" value="y">유</option>
                        <option name="chip" value="n">무</option>
                    </select>
                </div>
            </div>
            <div className="filter__box">
                <div className="filter__item">
                    <label htmlFor="cnt" className="filter__label">보기:</label>
                    <select name="cnt"  className="filter__select">
                        <option name="cnt" value={viewSt === 0? 16:10}>{viewSt === 0? "16개":"10개"}</option>
                        <option name="cnt" value={viewSt === 0? 24:20}>{viewSt === 0? "24개":"20개"}</option>
                        <option name="cnt" value={viewSt === 0? 32:30}>{viewSt === 0? "32개":"30개"}</option>
                    </select>
                </div>
                <div className="filter__item">
                    <button type="button" className="filter__item__btn">
                        <span className="material-symbols-outlined">{viewSt === 0 ? "gallery_thumbnail" : "lists"}</span>
                    </button>
                </div>
            </div>
            <div className="filter__box">
                <div className="filter__item">
                    <label htmlFor="date" className="filter__label">날짜:</label>
                    <input type="date" className="filter__input"/>
                    ~
                    <input type="date" className="filter__input"/>
                </div>
                <div className="filter__item">
                    <input type="text" className="filter__input"/>
                    <button type="button" className="filter__item__btn">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filter;