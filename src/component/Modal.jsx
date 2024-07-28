import React, {useEffect} from "react";

const Modal = ({size, title, closeAction,btnAction,btnText,children})=>{
    useEffect(() => {
        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return(
        <div className='modal__container' onClick={closeAction}>
            <div className={`modal__content modal__content-${size}`} onClick={(e)=>{e.stopPropagation()}}>
                <div className="modal__box">
                    <div className="modal__header">
                        <h2>{title}</h2>
                        <button className="btn__user__small btn__user__mute" onClick={closeAction}>X</button>
                    </div>
                    <hr className="modal__line"/>
                    {
                        children
                    }
                    <button
                        className="btn__modal btn__user btn__user__positive"
                        onClick={btnAction}>{btnText}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Modal;