import '../css/App.css';
import Main from "./Main.js";
import {Route, Routes} from "react-router-dom";
import React from "react";
import SubLayout from "../component/SubLayout.jsx";
import Layout from "../pages/main/Layout.jsx";
import Notice from "../pages/info/Notice.jsx";
import Info from "../pages/info/Info.jsx";
import Organization from "../pages/info/Organization.jsx";
import Map from "../pages/info/Map.jsx";
import Missing from "../pages/missing/missing.jsx";
import Protection from "../pages/protection/protection.jsx";
import Dog from "../pages/protection/dog.jsx";
import Cat from "../pages/protection/Cat.jsx";
import Write from "../pages/info/Write.jsx";

function App() {
   return(
       <Routes>
           <Route path="/" element={<Layout />}>
                <Route index element={<Main/>} />
                <Route path="info" element={<SubLayout/>}>
                    <Route index element={<Info />} />
                    <Route path="notice"  element={<Notice />} />
                    <Route path="orgn" element={<Organization />} />
                    <Route path="map" element={<Map />} />
                </Route>
               <Route path="missing" element={<SubLayout/>}>
                   <Route index element={<Missing />} />
               </Route>
               <Route path="protection" element={<SubLayout/>}>
                   <Route index element={<Protection />} />
                   <Route path="dog" element={<Dog />} />
                   <Route path="cat" element={<Cat />} />
               </Route>
           </Route>
           <Route path="/test" element={<Main />} />
           <Route path="*" element={<Main />} />
       </Routes>
   )
}

export default App;
