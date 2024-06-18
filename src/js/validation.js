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