import React from "react";
import "../../css/Main.css"

function Info() {
    return (
        <>
            <div className="info__box"/>
            <div className="info__img"/>
            <div className="info__contents">
                <div className="info__header">동행동물 보호소에 오신 것을 환영합니다!</div>
                <div className="info__text">
                    {"사랑과 배려로 가득 찬 곳, 동행동물보호소를 소개합니다.\n"+
                    "우리는 모든 동물이 안전하고 행복한 환경에서 살 수 있는 세상을 소망합니다.\n"+
                    "우리 곁의 동물을 보호하는 것을 넘어, 그들에게 새로운 가정을 찾아주는 일에도 마음을 다하고 있습니다.\n\n"+
                    "동행동물보호소에서는 동물들에게 필요한 의료적 치료와 올바른 사회화를 제공하고,\n"+
                    "새로운 가정을 찾을 때까지 보살피며 지원합니다.\n"+
                    "또한 지역 사회와 협력하여 동물 학대 예방에 노력하고,\n"+
                    "보호자들에게 책임 있는 동물 양육에 대한 교육을 제공합니다.\n\n"+
                    "우리는 모든 생명이 가치 있고 존중받을 자격이 있다고 믿습니다.\n"+
                    "동행동물보호소는 여러분의 도움과 지원이 필요합니다.\n"+
                    "여러분과 함께라면 우리는 더욱 많은 동물들에게 새 희망을 선물할 수 있습니다.\n"+
                    "함께해 주셔서 감사합니다.\n"}
                </div>
            </div>
            <div className="info__logo"/>
        </>
    )
}

export default Info;