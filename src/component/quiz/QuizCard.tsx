import React from 'react';

export interface QuizCardProps {
    number: number;
    question: string;
    options: string[];
}

export default function QuizCard(props: QuizCardProps) {
    return (
        <div className={"p-4 border rounded-lg shadow-sm bg-white"}>
            <h4>
                {props.number}. {props.question}
            </h4>
            <ul className={"list-disc list-inside space-y-1"}>
                {props.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                ))}
            </ul>
        </div>
    )
}