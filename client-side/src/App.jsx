// import { BrowserRouter, Routes } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import SignIn from "../../client/src/pages/SignIn";
import React from "react";
import SignIn from '../src/pages//SignIn';
import Header from "./Component/Header";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
export default function MyPage() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/register" element={<SignIn/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Payment/>}/>
    </Routes>
    </BrowserRouter>
  );
}