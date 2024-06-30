import React, {useRef, useState} from "react";
import Write from "../adoption/Write.jsx";
function Adoption() {
    const [activeTab, setActiveTab] = useState('Tab1');
    const contentsRef = useRef()

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [post, setPost] = useState([]);

    const write = ()=>{
        setIsEditable({"editable" : true, "type" : 1});
    }
    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    return (
        <>
            {(isEditable.editable) ?
                <Write  post={post} data={[]} isEditable={isEditable} changeEditable={setEditState} />
                :
                <>
                    <div className="tab__header">
                      <button onClick={() => handleTabClick('Tab1')}>입양과정(인터넷)</button>
                      <button onClick={() => handleTabClick('Tab2')}>입양과정(전화)</button>
                      <button onClick={() => handleTabClick('Tab3')}>Tab 3</button>
                    </div>
                    <div>
                        <button className="btn__adm__icon btn__adm__write" onClick={write}>
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                    </div>
                    <div className="tab__content">
                        {activeTab === 'Tab1' &&
                            <div>
                                <div>홈페이지 입양 신청</div>
                                <span>
                                            ※주의사항
                                            입양 희망 동물의 현재 상태가 '임시보호'일 경우
                                            입양신청이 가능한지 보호소에 먼저 확인 후 신청해주세요.
                                        </span>
                                <ul>
                                    <li>홈페이지에 회원가입을 해주세요.</li>
                                    <li>하단 입양 설문지를 다운로드 받아 작성해주세요.</li>
                                    <li>신청하기 탭으로 이동해 인적사항 작성 후,
                                        작성한 설문지를 첨부하여 제출해주세요.
                                    </li>
                                    <li>작성된 설문지를 1차 검토 후 선정된 분께 별도로 연락 드리겠습니다
                                        <span>소요 기간 : 3일 내</span>
                                        <span>공고기간이거나 입양문의가 많은 동물일 경우 검토기간이 길어질 수 있습니다.</span>
                                    </li>
                                    <li>
                                        별도 연락을 받은 분 께서는 보호소로 방문하시면 됩니다.
                                        <span>방문 날짜 및 시간은 조율 후 결정</span>
                                    </li>
                                    <li>대면 살담 진행 및 보호소 동물들을 살펴본 후 입양 희망 동물을 결정해주시면 됩니다.</li>
                                </ul>
                            </div>
                        }
                        {activeTab === 'Tab2' && <div>Content of Tab 2</div>}
                        {activeTab === 'Tab3' && <div>Content of Tab 3</div>}
                    </div>
                    <>
                        <span><storng>양식 다운로드</storng></span>
                        <ul>
                            <li>
                                <span className="file__title"></span>
                                <button className="btn__download"></button>
                            </li>
                        </ul>
                    </>
                </>
            }
        </>
    )

}
export default Adoption;