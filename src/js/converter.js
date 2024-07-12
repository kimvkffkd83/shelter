import Region from "../jsons/Region.json";
import Color from "../jsons/Color.json";

const cvt = {
    stSubDateCvt: (stSub)=>{
        switch (stSub){
            case 'a': return 10; //공고중;
            case 'b': return 0; //입양가능;
            case 'c': return 0; //입양예정;
            case 'd': return 0; //귀가예정;
            case 'e': return 10; //임시보호;
            case 'f': return 0; //입양완료;
            case 'g': return 0; //귀가;
            case 'h': return 0; //기증;
            case 'i': return 0; //자연사;
            case 'j': return 0; //안락사;
            case 'k': return 0; //방생;
            case 'l': return 0; //탈주;
            default : return 0;
        }
    },
    stSubPrtcCvt: (stSub)=>{
        switch (stSub){
            case 'a': return '공고중';
            case 'b': return '입양가능';
            case 'c': return '입양예정';
            case 'd': return '귀가예정';
            case 'e': return '임시보호';
            case 'f': return '입양완료';
            case 'g': return '귀가';
            case 'h': return '기증';
            case 'i': return '자연사';
            case 'j': return '안락사';
            case 'k': return '방생';
            case 'l': return '탈주';
            default : return '';
        }
    },
    stSubMissCvt: (stSub)=>{
        switch (stSub){
            case 'a': return '실종';
            case 'b': return '목격';
            case 'c': return '귀가';
            default : return '';
        }
    },
    adtType:(type) =>{
        switch (type){
            case 'a': return '입양';
            case 'b': return '임시보호';
            default : return '';
        }
    },
    adtSt:(st) =>{
        switch (st){
            case 'a': return '신청중';
            case 'b': return '검토중';
            case 'c': return '검토완료';
            default : return '';
        }
    },
    spcCvt : (stSub)=>{
        switch (stSub){
            case 1 :
            case '1': return '개';
            case 2:
            case '2': return '고양이';
            case 3:
            case '3': return '기타';
            default : return '';
        }
    },
    spcIconCvt : (stSub)=>{
        switch (stSub){
            case 1 :
            case '1': return '🐶';
            case 2:
            case '2': return '😺';
            case 3:
            case '3': return '기타';
            default : return '';
        }
    },
    sexCvt : (sex) =>{
        switch (sex) {
            case 'm':
            case 'M' : return "수컷"; break;
            case 'f':
            case 'F' : return "암컷"; break;
            case 'u':
            case 'U' : return "미상"; break;
            default : return '';
        }
    },
    chipCvt : (chip) =>{
        switch (chip) {
            case 'y':
            case 'Y' : return "유"; break;
            case 'n':
            case 'N' : return "무"; break;
            case 'u':
            case 'U' : return "모름"; break;
            default : return '';
        }
    },
    ntrCvt : (ntr) =>{
        switch (ntr) {
            case 'y':
            case 'Y' : return "유"; break;
            case 'n':
            case 'N' : return "무"; break;
            case 'u':
            case 'U' : return "모름"; break;
            default : return '';
        }
    },
    regionCvt: (region) =>{
        return Region.gu.map((g,index)=>{
            if(index+1 === Number(region)){
                return g.addrKR;
            }else{
                return '';
            }
        })
    },
    colorCvt: (colors) =>{
        let result = '';
        const resArr = [];
        if(colors.length > 0){
            const cArr = colors.split(",");
            cArr.map((c,idx) =>{
                resArr.push(Color[Number(c)].nameKr);
            })
            result = resArr.join(",");
        }
        return result;
    },
    phoneCvt: (number) =>{
        //번호 입력 시 핸드폰 번호 형식으로 변경
        return number
            .replace(/[^0-9]/g, '') // 숫자가 아닌 문자 제거
            .replace(/^(\d{3})(\d{3})(\d{4})$/g, "$1-$2-$3") // 10자리 숫자에 대한 패턴 매칭
            .replace(/^(\d{3})(\d{4})(\d{4})$/g, "$1-$2-$3") // 11자리 숫자에 대한 패턴 매칭
            .replace(/(\-{1,2})$/g, ""); // 끝에 붙은 하이픈 제거
    },
    timeTypeCvt:(type) =>{
        switch (type){
            case 'a' : return '오전';
            case 'b' : return '오후';
        }
    },
    timeAvailableCvt:(st)=>{
        switch (st){
            case 'a' : return '신청가능';
            case 'b' : return '신청마감';
            case 'c' : return '신청불가';
        }
    },
    dateYmdCvt:(date) =>{
        return date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    },
    dateYmdDashCvt:(date) =>{
        return date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');
    }
}
export default cvt;