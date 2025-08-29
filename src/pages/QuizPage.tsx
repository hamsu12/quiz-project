import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizCard, { QuizCardProps } from '../component/quiz/QuizCard';
import quizListData from '../data/quiz-list.json';
import './QuizPage.css';

type PassageImage = {
    image: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
};

type RawQuiz = {
    number: number;
    title: string;
    options: string[];
    passage?: string | (string | PassageImage)[];
    answer?: number;
    points?: number;
    explanation?: string | string[]; // 해설(옵션)
};


const SCORING_MS = 1400; // 로딩(채점중) 표시 시간

export default function QuizPage() {
    const { nickname } = useParams();
    const navigate = useNavigate();

    const safeNick = decodeURIComponent(nickname ?? '');
    const nickDisplay = safeNick || '0000';

    const quizzes = useMemo(() => {
        const rawList = quizListData as RawQuiz[];
        return rawList.map((q) => ({
            number: q.number,
            question: q.title,
            options: q.options,
            passage: q.passage,
            answer: typeof q.answer === 'number' ? q.answer - 1 : undefined, // 내부 0-based
            points: typeof q.points === 'number' ? q.points : 1,
            explanation: q.explanation,
        }));
    }, []);

    const [selected, setSelected] = useState<Record<number, number | null>>(
        () => Object.fromEntries(quizzes.map((q) => [q.number, null]))
    );

    const [showConfirm, setShowConfirm] = useState(false);
    const [unanswered, setUnanswered] = useState<number[]>([]);
    const [reviewMode, setReviewMode] = useState(false);
    const [score, setScore] = useState<number>(0);
    const [totals, setTotals] = useState({ totalQ: quizzes.length, totalPoints: 0, correct: 0 });

    const [isScoring, setIsScoring] = useState(false);
    const [showScore, setShowScore] = useState(false);

    const [showExit, setShowExit] = useState(false);

    const [showUAHighlight, setShowUAHighlight] = useState(false);

    const onSelect = (qnum: number, idx: number) => {
        if (reviewMode) return;
        setSelected((prev) => ({ ...prev, [qnum]: idx }));
    };

    const openFinish = () => {
        const ua = quizzes.filter((q) => selected[q.number] === null).map((q) => q.number);
        setUnanswered(ua);
        setShowUAHighlight(true);
        setShowConfirm(true);
    };
    const closeFinish = () => setShowConfirm(false);

    const goFirstUnanswered = () => {
        if (unanswered.length === 0) return;
        const id = `q-${unanswered[0]}`;
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShowConfirm(false);
    };

    const finishExam = () => {
        setShowConfirm(false);
        setIsScoring(true);

        let s = 0;
        let correct = 0;
        let totalPoints = 0;
        quizzes.forEach((q) => {
            totalPoints += q.points ?? 1;
            const sel = selected[q.number];
            if (q.answer !== undefined && sel !== null && sel === q.answer) {
                s += q.points ?? 1;
                correct += 1;
            }
        });

        setTimeout(() => {
            setScore(s);
            setTotals({ totalQ: quizzes.length, totalPoints, correct });
            setIsScoring(false);
            setShowScore(true);
            setReviewMode(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, SCORING_MS);
    };

    const closeScorePopup = () => setShowScore(false);
    const goHome = () => {
        setShowExit(false);
        navigate('/');
    };

    return (
        <div className="quiz-root">
            <div className="quiz-sheet">
                <div className="quiz-sticky">
                    <div className="sticky-bar">
                        <div className="sticky-left">
                            <span className="nickname-badge">{nickDisplay} 님</span>
                        </div>
                        <div className="quiz-header">
                            <h2 className="quiz-topline">2025학년도 8월 전국연합학력평가 문제지</h2>
                            <h1 className="quiz-title">팀샐러드 영역</h1>
                            {reviewMode && (
                                <div className="result-banner">
                                    총점 <strong>{score}</strong> / {totals.totalPoints}점 · 정답 {totals.correct}/{totals.totalQ}
                                </div>
                            )}
                        </div>
                        <div className="sticky-right" />
                    </div>
                    <hr className="quiz-divider" />
                </div>

                <div className="quiz-content">
                    <div className="quiz-list">
                        {quizzes.map((q) => (
                            <div key={q.number} id={`q-${q.number}`} className="quiz-item">
                                <QuizCard
                                    number={q.number}
                                    question={q.question}
                                    options={q.options}
                                    passage={q.passage}
                                    points={q.points}
                                    answer={q.answer}
                                    explanation={q.explanation}
                                    selectedIndex={selected[q.number]}
                                    onSelect={(idx) => onSelect(q.number, idx)}
                                    reviewMode={reviewMode}
                                    unansweredHighlight={(showUAHighlight || reviewMode) && selected[q.number] === null}
                                />
                            </div>
                        ))}

                        {!reviewMode && (
                            <button type="button" className="finish-button" onClick={openFinish}>
                                시험 종료하기
                            </button>
                        )}

                        {reviewMode && (
                            <button type="button" className="exit-button" onClick={() => setShowExit(true)}>
                                종료하기
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 종료 확인 모달 */}
            {showConfirm && (
                <div className="confirm-overlay" role="dialog" aria-modal="true">
                    <div className="confirm-card">
                        <div className="confirm-title">정말 시험을 종료하시겠습니까?</div>
                        {unanswered.length > 0 && (
                            <div className="confirm-warning">
                                미응답 문항 <strong>{unanswered.length}</strong>개가 있습니다:
                                <span className="confirm-ua-list"> {unanswered.join(', ')}</span>
                            </div>
                        )}
                        <p className="confirm-desc">종료하시면 취소하실 수 없습니다.</p>
                        <div className="confirm-actions">
                            {unanswered.length > 0 && (
                                <button className="btn ghost" onClick={goFirstUnanswered}>
                                    미응답으로 이동
                                </button>
                            )}
                            <button className="btn outline" onClick={closeFinish}>취소</button>
                            <button className="btn solid" onClick={finishExam}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 채점 중 로딩 */}
            {isScoring && (
                <div className="confirm-overlay" role="dialog" aria-modal="true">
                    <div className="score-loading">
                        <div className="loader" aria-hidden />
                        <div className="score-loading-text">채점 중...</div>
                    </div>
                </div>
            )}

            {/* 점수 팝업 */}
            {showScore && (
                <div className="confirm-overlay" role="dialog" aria-modal="true">
                    <div className="score-card">
                        <div className="score-title">채점 결과</div>
                        <div className="score-main">
                            <span className="score-number">{score}</span>
                            <span className="score-total">/ {totals.totalPoints}</span>
                        </div>
                        <div className="score-sub">
                            정답 {totals.correct}/{totals.totalQ}
                        </div>
                        <div className="confirm-actions" style={{ justifyContent: 'center' }}>
                            <button className="btn solid" onClick={closeScorePopup}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 리뷰 종료(메인으로) */}
            {showExit && (
                <div className="confirm-overlay" role="dialog" aria-modal="true">
                    <div className="confirm-card">
                        <div className="confirm-title2">많이 부족하지만 체험해주셔서 감사합니다 !!ㅎㅎ</div>
                        <div className="confirm-title2">♥</div>
                        <div className="confirm-actions" style={{ justifyContent: 'center' }}>
                            <button className="btn solid" onClick={goHome}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
