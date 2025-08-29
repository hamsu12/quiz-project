import React from 'react';

type PassageImage = {
    image: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
};

export interface QuizCardProps {
    number: number;
    question: string;
    options: string[];
    passage?: string | (string | PassageImage)[];
    points?: number;                 // 배점(선택)
    answer?: number;                 // 0-based 정답 인덱스(내부용)
    explanation?: string | string[]; // 해설(옵션)
    selectedIndex?: number | null;   // 부모 상태
    onSelect?: (index: number) => void;
    reviewMode?: boolean;            // 채점 후 표시 모드
    unansweredHighlight?: boolean;
}

const circled = (i: number) => String.fromCodePoint(0x2460 + i); // ①~⑩

export default function QuizCard({
                                     number,
                                     question,
                                     options,
                                     passage,
                                     points,
                                     answer,
                                     explanation,
                                     selectedIndex = null,
                                     onSelect,
                                     reviewMode = false,
                                     unansweredHighlight = false,
                                 }: QuizCardProps) {
    const renderPassage = () => {
        if (!passage) return null;
        const blocks = Array.isArray(passage) ? passage : passage.split('\n');
        return (
            <div className="quiz-passage">
                <div className="quiz-passage-label">- 지문 -</div>
                <div className="quiz-passage-body">
                    {blocks.map((b, i) =>
                        typeof b === 'string' ? (
                            <p key={i}>{b}</p>
                        ) : (
                            <figure key={i} className="quiz-figure">
                                <img
                                    src={b.image}
                                    alt={b.alt ?? ''}
                                    loading="lazy"
                                    style={{
                                        ...(b.width ? { width: `${b.width}px` } : {}),
                                        ...(b.height ? { height: `${b.height}px` } : {}),
                                    }}
                                />
                                {b.caption && (
                                    <figcaption className="quiz-figcaption">{b.caption}</figcaption>
                                )}
                            </figure>
                        )
                    )}
                </div>
            </div>
        );
    };

    const renderExplanation = () => {
        if (!reviewMode || !explanation) return null;
        const lines = Array.isArray(explanation) ? explanation : explanation.split('\n');
        return (
            <div className="quiz-explain">
                <div className="quiz-explain-title">해설</div>
                <div className="quiz-explain-body">
                    {lines.map((t, i) => (
                        <p key={i}>{t}</p>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="quiz-card">
            <h4 className={`quiz-q-title ${unansweredHighlight ? 'is-unanswered' : ''}`}>
                {number}. {question}
                {typeof points === 'number' && <span className="quiz-points">{points}점</span>}
            </h4>


            {renderPassage()}

            <ul className="quiz-opts">
                {options.map((opt, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isCorrect = reviewMode && answer === idx;
                    const isWrongSelected =
                        reviewMode && isSelected && answer !== undefined && answer !== idx;

                    return (
                        <li key={idx} className="quiz-opt">
                            <button
                                type="button"
                                className={[
                                    'quiz-opt-btn',
                                    isSelected ? 'active' : '',
                                    isCorrect ? 'correct' : '',
                                    isWrongSelected ? 'wrong' : '',
                                    reviewMode ? 'disabled' : '',
                                ].join(' ')}
                                onClick={() => !reviewMode && onSelect?.(idx)}
                                aria-pressed={isSelected}
                                aria-label={`${number}번 보기 ${idx + 1}`}
                            >
                                <span className="quiz-opt-no">{circled(idx)}</span>
                                <span className="quiz-opt-text">{opt}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {renderExplanation()}
        </div>
    );
}
