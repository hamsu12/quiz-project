import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function MainPage() {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleStart=()=>{
        if(nickname.trim()){
            navigate(`/quiz/${encodeURIComponent(nickname.trim())}`);
        }
    }

    return (
      <div className={"main-page"}>
          <h3>퀴즈</h3>
          <input type="text" placeholder="닉네임을 입력하세요 ! " value={nickname}
                 onChange={(e) => setNickname(e.target.value)}
          className={"main-input"}/>
          <button type={"submit"} className={"main-button"}
          onClick={handleStart}>
              Start</button>

      </div>
    );
}