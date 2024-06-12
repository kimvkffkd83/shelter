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
}
export default vdt;