import Calendar from 'react-calendar';
import React, {useEffect, useRef, useState} from "react";
import Volunteer from "../../api/Volunteer.jsx";
import cvt from "../../js/converter.js";
import vdt from "../../js/validation.js";

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

    //종+타임 조합 (개오전 / 고양이오후 등) str 만드는 cvt
    const timeTitleStr = (spc,type,maxCnt)=>{
        let str = '';
        str += cvt.spcIconCvt(spc);
        str += cvt.timeTypeCvt(type);
        str += `(${maxCnt}/`;
        return str;
    }

    const timeListStr = (spc,type,maxCnt)=>{
        let str = '';
        str += cvt.spcCvt(spc);
        str += cvt.timeTypeCvt(type);
        return str;
    }

    //오늘부터 일주일까지만 신청가능 상태를 뿌릐고
    //해당 날짜가 마감됐을 시 신청마감으로 변경되어 떠야함
    //  해당 타일을 누르면 하단에 신청 폼이 뜨게
    //  종과 타임을 고르고 이름, 연락처 기재
    //  신청 전에 해당 날짜, 타임 마감 유무 먼저 체킹하기
    //  해당키의 maxCnt 보면 될듯?(프로시저 내부에서 해보자)
    //  key, datekey, 등록일, 이름, 연락처 받기

    // const applyAction = (date)=>{
    //     console.log(date)
    // }
    //
    // const ApplyBtn = (date)=> {
    //     console.log(date);
    //     return(
    //         <button onClick={()=>applyAction(date)}>신청하기</button>
    //     )
    // }

    const [selectedDate, setSelectedDate] = useState(null);
    const selectDate = (date)=>{
        setSelectedDate(new Date(date))
    }

    const [dayList, setDayList] = useState([])
    const getDayList = (date) =>{
        if(date){
            Volunteer.dayList(cvt.dateYmdCvt(date)).then((res) =>{
                setDayList(res);
                console.log(res)
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
                {
                    <div className="calender__tile__box">{
                        aList.map((item,idx)=>{
                            if(day === item.time) return (
                                <p key={idx}
                                   className={`calender__tile__title ${item.maxCnt === item.nowCnt ? ' calender__tile__title-end' : ''}`}>
                                    {
                                        timeTitleStr(item.spc, item.type, item.maxCnt)

                                    }
                                    <span className='calender__tile__title-remain'>{item.nowCnt}</span>
                                    )
                                </p>
                            )
                        })
                    }
                    </div>
                }
            </>
        )
    }

    const [selectedTime,setSelectedTime] = useState();

    const apply = ()=>{
        const data = {
            "USER_NO" : 4,
            "USER_ID" : 'normal1',
            "USER_NM" : nameRef.current.value,
            "USER_CALL" : phoneRef.current.value.replaceAll("-",''),
            "TIME_NO" : selectedTime,
            "REG_YMD" : newDate
        }

        console.log(data);
        Volunteer.apply(data).then((res) =>{
            console.log(res);
        })
    }

    return (
        <>
            <Calendar
                prev2Label={null}
                prevLabel={<span className="material-symbols-outlined">chevron_left</span>}
                next2Label={null}
                nextLabel={<span className="material-symbols-outlined">chevron_right</span>}
                showNeighboringMonth={false}
                tileContent = {
                    ({date}) => date > today ? <AvailableStr date={date} /> : null}
                onClickDay = {
                    (value) => selectDate(value)
                }
            />
            <div>
                {
                    selectedDate &&
                    <>
                        {
                            dayList.length === 0 || selectedDate < today?
                                <>
                                    해당 날짜에는 신청할 수 있는 봉사활동이 없습니다.
                                </> :
                                <>
                                    <div className="box__post">
                                        <div className="flex_container">
                                            <div className="w50">
                                                <h4>신청 정보 입력</h4>
                                                <div className="post__item">
                                                    <span className="post__item__title">선택</span>
                                                    <div className="post__item__contents">
                                                        <div className="button-div__box" defaultValue={0}>
                                                            {
                                                                dayList.map((day, idx) => (
                                                                    <>
                                                                        <input type="radio" key={idx}
                                                                               id={`${day.time}${idx}`}
                                                                               defaultChecked={idx === 0}
                                                                               name={day.time}
                                                                               onClick={() => setSelectedTime(day.tNo)}
                                                                               value={day.tNo}/>
                                                                        <label className="post__item__label"
                                                                               htmlFor={`${day.time}${idx}`}>{timeListStr(day.spc, day.type)}</label>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="post__item">
                                                    <span className="post__item__title">날짜</span>
                                                    <div className="post__item__contents">
                                                        <span
                                                            className="post__item__text">{cvt.dateYmdDashCvt(selectedDate)}</span>
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
                                            </div>
                                            <div className="w50">
                                                여기에 해당날짜 지원자 목록뜨게
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </>
                }
            </div>
        </>
    );
}

export default Reservation;