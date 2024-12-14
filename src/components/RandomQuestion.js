import React from "react";
import "./../css/RandomQuestion.css";

const RandomQuestion = () => {
    const question = {
        text: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
    };

    return (
        <div className="random-question">
            <h3>{question.text}</h3>
            <ul>
                {question.options.map((option, index) => (
                    <li key={index}>{option}</li>
                ))}
            </ul>
        </div>
    );
};

export default RandomQuestion;
