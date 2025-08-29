import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const EXACT_PHRASE = '르 파라느 다말라두';
const INTRO_MS = 4000;

export default function MainPage() {
    const [nickname, setNickname] = useState('');
    const [signature, setSignature] = useState('');
    const [examNo] = useState('19950828');

    const [nameError, setNameError] = useState(false);
    const [signError, setSignError] = useState(false);

    const [showIntro, setShowIntro] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        alert('원활한 이용을 위해 PC(데스크톱) 사용을 권장드립니다 !\n모바일/태블릿에서는 화면이 일부 깨질 수 있어요.');
    }, []);

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

        setShowIntro(true);

        setTimeout(() => {
            navigate(`/quiz/${encodeURIComponent(nickname.trim())}`);
        }, INTRO_MS);
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
                            maxLength={4}
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

                <button className="start-button" onClick={handleStart} disabled={showIntro}>
                    * 시험이 시작되기 전까지 버튼을 클릭하지 마시오.
                </button>

                <div className="footer">함수광역시 교육청</div>
            </div>

            {showIntro && (
                <div
                    className="intro-overlay"
                    role="dialog"
                    aria-modal="true"
                    style={{ ['--intro-duration' as any]: `${INTRO_MS}ms` }}
                >
                    <div className="intro-card">
                        <div className="intro-title">
                            <span className="intro-span"> 응시자 : </span>{nickname}
                        </div>
                        <div className="intro-title">
                            <span className="intro-span">수험번호</span> : {examNo}
                        </div>
                        <div className="intro-title">
                            <span className="intro-span">총 문항 수 : 15개</span>
                        </div>
                        <div className="intro-title2">시험을 시작합니다!</div>
                        <div className="intro-bar">
                            <span />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
