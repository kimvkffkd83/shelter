import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Orga from "../../api/Orga.jsx";

function Organization() {
    const [department, setDepartment] = useState([]);
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

    useEffect(() => {
        Orga.list().then((res)=>{
            setDepartment(res);
        })
    }, []);

    useEffect(() => {
        Orga.list().then((res)=>{
            setTeam1(department.filter((dpt) => dpt.drank === 1));
            setTeam2(department.filter((dpt) => dpt.drank > 1));
        })
    }, [department]);

    return (
        <div className="orga">
            <h1 className="orga__title">조직도</h1>
            { department && team1 && team2 &&
                <>
                    <div className="orga__team">
                        <div className="orga__box">
                            <div className="orga__team-name">{team1[0]?.dname}</div>
                            <div className="orga__team-work">
                                <span className="orga__team-work__text">{team1[0]?.dtask}</span>
                            </div>
                        </div>
                    </div>
                    <div className="orga__line-vertical"/>
                    <div className="orga__line-horizontal"/>
                    <div className="orga__line">
                        <div className="orga__line-vertical"/>
                        <div className="orga__line-vertical"/>
                    </div>
                    <div className="orga__team">
                        {team2.map((dpt, idx) => (
                            <div key={idx} className="orga__box-sub">
                                <div className="orga__team-name">{dpt.dname}</div>
                                <div className="orga__team-work">
                                    <span className="orga__team-work__text__sub">{dpt.dtask}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h1 className="orga__title">연락망</h1>
                    <div className="orga__contact">
                        {department.map((dpt,idx) => (
                            <div key={idx} className="orga__contact__box">
                                <div className="orga__team-name">{dpt.dname + '팀'}</div>
                                <div className="orga__team-call"><span
                                    className="material-symbols-outlined">call</span>{dpt.dcall}</div>
                                <div className="orga__team-mail"><span
                                    className="material-symbols-outlined">mail</span>{dpt.dmail}</div>
                            </div>
                        ))}
                    </div>
                </>
            }


        </div>
    )
}

export default Organization;