import {useEffect, useRef, useState} from "react";

export default function useRefFocusEffect(){
    const ref = useRef();
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        if(ref.current){
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShowTopBtn(false);
                        console.log("헤더 보임")
                    } else {
                        setShowTopBtn(true);
                        console.log("헤더 가려짐")
                    }
                });
            },{
                threshold:1
            });

            observer.observe(ref.current);

            return ()=>{
                if(ref.current) observer.unobserve(ref.current);
            };
        }
    }, []);

    return {ref,showTopBtn};
}

