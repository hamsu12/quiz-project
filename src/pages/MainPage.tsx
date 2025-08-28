import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const EXACT_PHRASE = '르 파라느 다말라두';

export default function MainPage() {
    const [nickname, setNickname] = useState('');
    const [signature, setSignature] = useState('');
    const [examNo] = useState('19950828'); // 고정값

    const [nameError, setNameError] = useState(false);
    const [signError, setSignError] = useState(false);

    const navigate = useNavigate();

    const handleStart = () => {
        let valid = true;

        const hasWhitespace = /\s/.test(nickname);
        if (nickname.length === 0 || nickname.length > 4 || hasWhitespace) {
            setNameError(true);
            alert('이름은 공백 없이 최대 4글자까지 입력하세요.');
            valid = false;
        } else {
            setNameError(false);
        }

        if (signature !== EXACT_PHRASE) {
            setSignError(true);
            alert('필적확인란을 올바르게 기재하세요.');
            valid = false;
        } else {
            setSignError(false);
        }

        if (!valid) return;

        navigate(`/quiz/${encodeURIComponent(nickname.trim())}`);
    };

    return (
        <div className="main-page">
            <div className="sheet">
                <h2 className="sheet-title">2025학년도 8월 전국연합학력평가 문제지</h2>
                <h1 className="sheet-subtitle">팀샐러드 영역</h1>

                <div className="id-row">
                    <div className="id-field">
                        <div className="id-lable">성명</div>
                        <input
                            type="text"
                            className={`id-input ${nameError ? 'error' : ''}`}
                            placeholder="* 빈칸없이 왼쪽부터 최대 4자 기재"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onFocus={() => setNameError(false)}
                            aria-invalid={nameError}
                        />
                    </div>

                    <div className="id-field">
                        <div className="id-lable">수험번호</div>
                        <input
                            type="text"
                            className="id-input readonly"
                            value={examNo}
                            disabled
                            aria-readonly="true"
                        />
                    </div>
                </div>

                <div className="notice-card">
                    <ul className="notice-list">
                        <li>문제지의 해당란에 성명과 수험 번호를 정확히 쓰시오.</li>
                        <li>답안지의 필적 확인란에 다음과 같은 문구를 정확히 기재하시오.</li>
                    </ul>
                    <input
                        type="text"
                        className={`notice-input ${signError ? 'error' : ''}`}
                        placeholder={EXACT_PHRASE}
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        onFocus={() => setSignError(false)}
                        aria-invalid={signError}
                    />
                </div>

                <button className="start-button" onClick={handleStart}>
                    * 시험이 시작되기 전까지 버튼을 클릭하지 마시오.
                </button>

                <div className="footer">함수광역시 교육청</div>
            </div>
        </div>
    );
}
