import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import { fetchUser } from "./utils/fetchUser";
//test
const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    
    if(!user) navigate('/login');
  }, [navigate])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
