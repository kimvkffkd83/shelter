import Statistics from "../../pages/main/Statistics.jsx";
import React from "react";

const Footer = ()=> {
    return(
        <div id="footer">
            <div className="ft__box">
                <div className="ft__box__title">
                    <strong>동행동물보호소</strong>
                </div>
                <div className="ft__box__content">
                    광주광역시 북구 OO대로 123-4
                </div>
                <div className="ft__box__content">
                    <i>※ 해당 페이지는 개인 포트폴리오용으로 제작하여 실제로 운영하지 않음을 밝힙니다.</i>
                </div>
            </div>
            <div className="ft__box">
                <Statistics/>
            </div>
        </div>
    )
}

export default Footer