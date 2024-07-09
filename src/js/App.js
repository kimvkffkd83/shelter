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
               <Route path="*" element={<Error />} />
           </Route>
           <Route path="/test" element={<Main />} />
       </Routes>
   )
}

export default App;
