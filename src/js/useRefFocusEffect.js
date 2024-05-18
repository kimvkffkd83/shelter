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
                    } else {
                        setShowTopBtn(true);
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

