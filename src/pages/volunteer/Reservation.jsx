import Calendar from 'react-calendar';
import React, {useEffect, useRef, useState} from "react";
import Volunteer from "../../api/Volunteer.jsx";
import cvt from "../../js/converter.js";
import vdt from "../../js/validation.js";
import {logDOM} from "@testing-library/react";

const Reservation = ()=>{
    const today = new Date();
    const newDate = cvt.dateYmdCvt(today);

    const nameRef = useRef();
    const phoneRef = useRef();

    const chkWhenBlur = (func, ref, id)=>{
        if(!func(ref.current.value)){
            document.querySelector(`div[id=${id}]`).style.display = 'flex';
            ref.current.focus();
        }else{
            document.querySelector(`div[id=${id}]`).style.display = 'none';
        }
    }
    
    const [aList, setAList] = useState([]);
    const getList = ()=>{
        Volunteer.list().then((res)=>{
            console.log(res);
            setAList(res);
        })
    }

    useEffect(() => {
        getList();
    }, []);

    const [selectedDate, setSelectedDate] = useState(null);
    const selectDate = (date)=>{
        setSelectedDate(new Date(date))
    }

    const [dayAbleList, setDayAbleList] = useState([])
    const [dayRegList, setDayRegList] = useState([])
    const getDayList = (date) =>{
        if(date){
            Volunteer.dayList(cvt.dateYmdCvt(date)).then((res) =>{
                setDayAbleList(res.ableList);
                setDayRegList(res.regList);
                setSelectedTimeNo(res.ableList[0]?.tNo)
                setSelectedSsnNo(res.ableList[0]?.sNo)
                console.log(res);
            })
        }
    }

    useEffect(() => {
        getDayList(selectedDate);
    }, [selectedDate]);

    const AvailableStr = (date) =>{
        const day = cvt.dateYmdCvt(new Date(date.date));
        return(
            <>
                <div className="calender__tile__box">
                    {
                        aList.map((item,idx)=>{
                            if(day === item.time) return (
                                <div key={idx}
                                    className="calender__tile__item">
                                    <p
                                       className={`calender__tile__title ${item.maxCnt === item.nowCnt ? ' calender__tile__title-end' : ''}`}>
                                        {
                                            item.title + "(" + item.maxCnt + "/"
                                        }
                                        <span className='calender__tile__title-remain'>{item.nowCnt}</span>
                                        )
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                <>
                    {
                        (date.date <= today)&&
                        <div className="calender__tile__covor">마감완료</div>
                    }
                </>
            </>
        )
    }

    const [selectedTimeNo,setSelectedTimeNo] = useState(dayAbleList[0]?.tNo || 0);
    const [selectedSsnNo,setSelectedSsnNo] = useState(dayAbleList[0]?.sNo || 0);
    const handleChange = (e) => {
        setSelectedTimeNo(e.target.value);
        setSelectedSsnNo(e.target.dataset.sNo);
    };

    const reset = () =>{
        setSelectedDate(null);
        getList();
    }

    const apply = ()=>{
        if(window.confirm('신청하시겠습니까?')){
            const data = {
                "USER_NO": 4,
                "USER_ID": 'normal1',
                "TIME_NO": selectedTimeNo,
                "SSN_NO": selectedSsnNo,
                "USER_NM": nameRef.current.value,
                "USER_CALL": phoneRef.current.value.replaceAll("-", ''),
                "RSV_YMD": cvt.dateYmdCvt(selectedDate),
                "REG_YMD": newDate
            }

            // 체크
            Volunteer.chkBeforeApply(data).then((res) =>{
                if(res[0].result === 0){
                    alert("해당 날짜에 신청할 수 있는 봉사활동이 없습니다.");
                }else{
                    Volunteer.apply(data).then((res) =>{
                        const selected = document.getElementsByClassName("radio__box-wide-selected");
                        const selectedText = selected[0].children[1].innerHTML;
                        alert(`${cvt.dateYmdDashCvt(selectedDate)} [${selectedText} 섹션]\n봉사활동 신청이 완료되었습니다.`)
                        reset();
                    }).catch ((error) =>{
                        alert(error.message);
                    })
                }
            });
        }
    }

    return (
        <>
            <Calendar
                prev2Label={null}
                prevLabel={<span className="material-symbols-outlined">chevron_left</span>}
                next2Label={null}
                nextLabel={<span className="material-symbols-outlined">chevron_right</span>}
                showNeighboringMonth={false}
                // tileContent = {
                //     ({date}) => date < today ? <AvailableStr date={date} /> : null}
                tileContent = {
                    ({date}) => <AvailableStr date={date} /> }
                onClickDay = {
                    (value) => selectDate(value)
                }
            />
            <div>
                {
                    selectedDate &&
                    <>

                        <div className="box__post">
                            <div className="flex_container">
                                <div className="w50">
                                    <h4>신청 정보 입력</h4>
                                    {
                                        dayAbleList.length === 0 || selectedDate < today ?
                                            <div className="post__item post__item-no-data">
                                                ⚠️ 해당 날짜에는 신청할 수 있는 봉사활동이 없습니다.
                                            </div> :
                                            <>
                                                <div className="post__item">
                                                    <span className="post__item__title">선택</span>
                                                    <div className="post__item__contents">
                                                        <div className="post__item__radio__box">
                                                            {
                                                                dayAbleList.map((day, idx) => (
                                                                    <div key={idx}
                                                                         className={`radio__box-wide${selectedTimeNo === day.tNo ? ' radio__box-wide-selected' : ''}`}
                                                                         onClick={() => {
                                                                             setSelectedTimeNo(day.tNo);
                                                                             setSelectedSsnNo(day.sNo);
                                                                         }}
                                                                    >
                                                                        <input type="radio"
                                                                               id={`${day.time}${idx}`}
                                                                               className="input__radio-wide"
                                                                               name={day.time}
                                                                               onChange={handleChange}
                                                                               checked={selectedTimeNo === day.tNo}
                                                                               data-ssn-no={day.sNo}
                                                                               value={day.tNo}/>
                                                                        <label className="input__radio__label-wide"
                                                                               htmlFor={`${day.time}${idx}`}>{day.title}</label>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="post__item">
                                                    <span className="post__item__title">날짜</span>
                                                    <div className="post__item__contents">
                                                        <span className="post__item__text">{cvt.dateYmdDashCvt(selectedDate)}</span>
                                                    </div>
                                                </div>
                                                <div className="post__item">
                                                    <span className="post__item__title">성명</span>
                                                    <div className="post__item__contents">
                                                        <input className="post__item__input" ref={nameRef}
                                                               onBlur={() => chkWhenBlur(vdt.chkKoreanName, nameRef, 'nameErr')}
                                                        />
                                                    </div>
                                                </div>
                                                <div id="nameErr" className="post__item post__item-error">
                                                    <span className="post__item__title"></span>
                                                    <div className="post__item__contents">
                                                        <span>정확한 성명을 입력하세요.</span>
                                                    </div>
                                                </div>
                                                <div className="post__item">
                                                    <span className="post__item__title">연락처</span>
                                                    <div className="post__item__contents">
                                                        <input className="post__item__input" ref={phoneRef}
                                                               onKeyUp={() => phoneRef.current.value = cvt.phoneCvt(phoneRef.current.value)}
                                                               onKeyDown={() => phoneRef.current.value = cvt.phoneCvt(phoneRef.current.value)}
                                                               onBlur={() => chkWhenBlur(vdt.chkPhoneNumber, phoneRef, 'phoneErr')}
                                                               placeholder="'-'를 제외한 숫자만 입력해주세요."
                                                        />
                                                    </div>
                                                </div>
                                                <div id="phoneErr" className="post__item post__item-error">
                                                    <span className="post__item__title"></span>
                                                    <div className="post__item__contents">
                                                        <span>정확한 연락처를 입력하세요.</span>
                                                    </div>
                                                </div>
                                                <div className="post__item">
                                                    <button onClick={apply}>신청하기</button>
                                                </div>
                                            </>
                                    }
                                </div>
                                <div className="w50">
                                    <h4>지원 정보</h4>
                                    {
                                        dayRegList.length === 0 ?
                                            <div className="post__item post__item-no-data">
                                                ⚠️ 해당 날짜에 조회 가능한 봉사자가 없습니다.
                                            </div> :
                                            <table className="vol__list__table">
                                                <tbody>
                                                    <tr className="vol__list__tr">
                                                        <td className="vol__list__td w10">번호</td>
                                                        <td className="vol__list__td w20">성명</td>
                                                        <td className="vol__list__td w30">연락처</td>
                                                        <td className="vol__list__td w20">구분</td>
                                                        <td className="vol__list__td w30">시간</td>
                                                    </tr>
                                                    {
                                                        dayRegList.map((item, idx)=>(
                                                            <tr key={idx} className="vol__list__tr">
                                                                <td className="vol__list__td w10">{idx+1}</td>
                                                                <td className="vol__list__td w20">{cvt.nameStarCvt(item.name)}</td>
                                                                <td className="vol__list__td w30">{cvt.phoneStarCvt(item.phone)}</td>
                                                                <td className="vol__list__td w20">{item.title}</td>
                                                                <td className="vol__list__td w30">{item.time}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default Reservation;