import '../css/App.css';
import Main from "../pages/main/Main.js";
import {Route, Routes} from "react-router-dom";
import React from "react";
import SubLayout from "../component/SubLayout.jsx";
import Layout from "../pages/main/Layout.jsx";
import Notice from "../pages/info/Notice.jsx";
import Info from "../pages/info/Info.jsx";
import Organization from "../pages/info/Organization.jsx";
import Map from "../pages/info/Map.jsx";
import Missing from "../pages/missing/Missing.jsx";
import Protection from "../pages/protection/Protection.jsx";
import Error from "../pages/main/Error.jsx";
import Adoption from "../pages/adoption/Adoption.jsx";
import Application from "../pages/adoption/Application.jsx";
import Review from "../pages/adoption/Review.jsx";
import Guide from "../pages/volunteer/Guide.jsx";
import Reservation from "../pages/volunteer/Reservation.jsx";
import Question from "../pages/volunteer/Question.jsx";
import Login from "../pages/user/Login.jsx";
import WideLayout from "../component/WideLayout.jsx";
import MyPage from "../pages/user/MyPage.jsx";
import SignUp from "../pages/user/SignUp.jsx";

function App() {
   return(
       <Routes>
           <Route path="/" element={<Layout />}>
                <Route index element={<Main/>} />
                <Route path="info" element={<SubLayout/>}>
                    <Route index element={<Info />} />
                    <Route path="notice" element={<Notice />} />
                    <Route path="orgn" element={<Organization />} />
                    <Route path="map" element={<Map />} />
                </Route>
               <Route path="missing" element={<SubLayout/>}>
                   <Route index element={<Missing />} />
               </Route>
               <Route path="protection" element={<SubLayout/>}>
                   <Route index element={<Protection />} />
               </Route>
               <Route path="adopt" element={<SubLayout/>}>
                   <Route index element={<Adoption />} />
                   <Route path="apply" element={<Application />} />
                   <Route path="review" element={<Review />} />
               </Route>
               <Route path="volunteer" element={<SubLayout/>}>
                   <Route index element={<Guide />} />
                   <Route path="application" element={<Reservation />} />
                   <Route path="question" element={<Question />} />
               </Route>
               <Route path="login" element={<WideLayout />}>
                   <Route index element={<Login />} />
               </Route>
               <Route path="signUp" element={<WideLayout />}>
                   <Route index element={<SignUp />} />
               </Route>
               <Route path="myPage" element={<WideLayout />}>
                   <Route index element={<MyPage />} />
               </Route>
               <Route path="*" element={<Error />} />
           </Route>
           <Route path="/test" element={<Main />} />
       </Routes>
   )
}

export default App;
