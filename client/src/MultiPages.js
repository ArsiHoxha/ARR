import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import App from "./App";
import Home from "./components/Profile";
import SuccessPage from "./Succes";

function MultiPages() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<App />} />
                <Route path="/home" element={<Home />} />
                <Route path="/succes" element={<SuccessPage></SuccessPage>} />




            </Routes>
        </Router>
    );
}
 
export default MultiPages;
