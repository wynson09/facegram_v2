import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
//test
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
