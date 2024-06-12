import Region from "../jsons/Region.json";

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
    stSubCvt: (stSub)=>{
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
    spcCvt : (stSub)=>{
        switch (stSub){
            case '1': return '개';
            case '2': return '고양이';
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
    regionCvt: (region) =>{
        return Region.gu.map((g,index)=>{
            if(g.no === Number(region)){
                return g.addrKR;
            }else{
                return '';
            }
        })
    },
}
export default cvt;