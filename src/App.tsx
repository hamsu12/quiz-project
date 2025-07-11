import React from 'react';
import './App.css';
import MainPage from "./pages/MainPage";
import {Route, Routes} from "react-router-dom";
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/quiz/:nickname" element={<QuizPage/>}/>
    </Routes>
  );
}