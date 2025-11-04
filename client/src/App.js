import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        </Routes> 
    </Router>
  </React.StrictMode>
);



