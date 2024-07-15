const vdt = {
    chkInputLength : (ref,length)=> {
        if (ref && ref.current && ref.current.value.length > length) {
            ref.current.value = ref.current.value.slice(0,length-1)
        }
    },
    chkInputIsEmpty : (flag,ref,comment) => {
        // flag 형 : {pass : true, comment : ''};
        if(!flag.pass) return flag;
        if(ref.current.value ===''){
            flag.pass = false;
            flag.comment = comment;
            ref.current.focus();
        }
        return flag;
    },
    chkSelectIsEmpty : (flag, ref, comment) => {
        if (!flag.pass) return flag;
        if (ref.current.value <= 0) {
            flag.pass = false;
            flag.comment = comment;
        }
        return flag;
    },
    chkId:(id)=>{
        // id 규칙: 영문 소문자+숫자 포함 6~12자(영문 소문자로 시작할 것.)
        const ex = /^(?=.*[a-z])(?=.*\d)[a-z][a-z0-9]{5,11}$/
        return ex.test(id);
    },
    chkPassword:(pw) =>{
        // pw 규칙: 영문 대,소문자+숫자+특수문자 포함 8~16자, 사용가능 특수문자는 !@#$%^&*
        const ex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,16}$/
        return ex.test(pw);
    },
    chkPhoneNumber:(number) =>{
        const temp = number.replaceAll('-','');
        const ex = /^[0-9]{10,11}$/
        return ex.test(temp);
    },
    chkKoreanName:(name)=>{
        const ex = /^[/가-힣/]{2,}$/;
        return ex.test(name);
    },
    chkMailAddress:(address) =>{
        const ex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
        return ex.test(address);
    },
    chkSerialNo:(no) =>{ //일련번호
        const ex = /^\d{4}-\d{4}$/
        return ex.test(no);
    },
    chkSerialNoV2:(no) =>{ //빈칸 or 일련번호
        const ex = /^$|^\d{4}-\d{4}$/
        return ex.test(no);
    },
    chkBirthYear : (year) => { //잘못된 년도면 true
        const date = new Date();
        return (1900 > year || year > date.getFullYear());
    },
    chkBirthMonth : (month) =>{ //잘못된 달이면 true
        return (0 > month  || month > 13)
    },
    chkWeight : (weight) =>{ //잘못된 체중이면 true
        return weight < 0
    },
    chkIsEarlier : (date1, date2) =>{ //잘못된 날짜(늦은 날짜)면 true;
        return (new Date(date1)) >  (new Date(date2))
    }
}
export default vdt;