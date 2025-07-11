import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';


export default function QuizPage() {
    const {nickname} = useParams();
    const navigate = useNavigate();

    const safeNick = decodeURIComponent(nickname ?? '');

    return (
        <div className={"quiz-page"}>
            <h3>{safeNick}님, 안녕하세요 !</h3>
            <button onClick={()=> navigate("/")}>뒤로 가기</button>
        </div>
    );
}