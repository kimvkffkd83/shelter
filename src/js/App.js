import '../css/App.css';
import Main from "./Main.js";
import {Route, Routes} from "react-router-dom";
import React from "react";
import InfoLayout from "../pages/info/InfoLayout.jsx";
import Layout from "../pages/main/Layout.jsx";
import Notice from "../pages/info/Notice.jsx";
import Info from "../pages/info/Info.jsx";
import Organization from "../pages/info/Organization.jsx";
import Map from "../pages/info/Map.jsx";

function App() {
   return(
       <Routes>
           <Route path="/" element={<Layout />}>
                <Route index element={<Main/>} />
                <Route path="info" element={<InfoLayout/>}>
                    <Route index element={<Info />} />
                    <Route path="notice" element={<Notice />} />
                    <Route path="orgn" element={<Organization />} />
                    <Route path="map" element={<Map />} />
                </Route>
           </Route>
           <Route path="/test" element={<Main />} />
           <Route path="*" element={<Main />} />
       </Routes>
   )
}

export default App;
