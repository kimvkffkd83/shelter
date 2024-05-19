import {Link} from "react-router-dom";

function Error(){
    return (
        <div>
            <h1>해당 페이지를 찾을 수 없습니다.</h1>
            <Link className="btn__default" to="/"> 홈으로 돌아가기 </Link>
            <Link className="btn__default" to="/"> 오류 제보 </Link>
        </div>
    )
}
export default Error;