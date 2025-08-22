// QuizPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizCard, { QuizCardProps } from "../component/quiz/QuizCard";
import quizListData from '../data/quiz-list.json';

type RawQuiz = { number: number; title: string; options: string[] };

export default function QuizPage() {
    const { nickname } = useParams();
    const navigate = useNavigate();

    const safeNick = decodeURIComponent(nickname ?? '');

    const rawList = quizListData as RawQuiz[];
    const quizList: QuizCardProps[] = rawList.map(({ number, title, options }) => ({
        number,
        question: title,
        options,
    }));

    return (
        <div className="quiz-page">
            <h3>{safeNick}님, 안녕하세요 !</h3>
            <button onClick={() => navigate("/")}>뒤로 가기</button>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    {quizList.slice(0, 5).map((q) => (
                        <QuizCard key={q.number} number={q.number} question={q.question} options={q.options} />
                    ))}
                </div>
                <div className="space-y-4">
                    {quizList.slice(5).map((q) => (
                        <QuizCard key={q.number} number={q.number} question={q.question} options={q.options} />
                    ))}
                </div>
            </div>
        </div>
    );
}
