import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import QuestionForm from "../components/QuestionForm";
import "../css/CreateQuestion.css";
import "../css/Button.css";

const CreateQuestion = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const handleQuestionCreate = async (questionData) => {
        try {
            // Question will be created through the form component
            navigate("/manage-questions");
        } catch (error) {
            console.error("Error creating question:", error);
        }
    };

    return (
        <div className={`create-question-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="page-header">
                <h1>Create New Question</h1>
                <button 
                    className="custom-button secondary"
                    onClick={() => navigate("/manage-questions")}
                >
                    <span className="icon">←</span>
                    Back to Questions
                </button>
            </div>
            <div className="form-container">
                <QuestionForm onSubmit={handleQuestionCreate} />
            </div>
        </div>
    );
};

export default CreateQuestion;
