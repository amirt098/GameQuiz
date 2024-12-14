import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createQuestion, getCategories } from "../services/api";
import "../css/QuestionForm.css";

const QuestionForm = ({ onSubmit }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        question: "",
        category: "",
        difficulty: "easy",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: ""
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = await getCategories();
                setCategories(categoriesList);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const questionData = {
                ...formData,
                designer: user.name,
                status: "active"
            };

            const response = await createQuestion(questionData);
            if (response.success) {
                onSubmit?.(response.question);
            } else {
                setError("Failed to create question. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Error creating question:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="question-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label htmlFor="title">Question Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="question">Question Text</label>
                <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="Enter your question"
                    rows="4"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        required
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Answer Options</label>
                <div className="options-grid">
                    {formData.options.map((option, index) => (
                        <div key={index} className="option-item">
                            <label htmlFor={`option${index + 1}`}>Option {index + 1}</label>
                            <input
                                type="text"
                                id={`option${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Enter option ${index + 1}`}
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="correctAnswer">Correct Answer</label>
                <select
                    id="correctAnswer"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Correct Answer</option>
                    {formData.options.map((option, index) => (
                        option && (
                            <option key={index} value={option}>
                                Option {index + 1}: {option}
                            </option>
                        )
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="explanation">Explanation (Optional)</label>
                <textarea
                    id="explanation"
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    placeholder="Explain why this is the correct answer"
                    rows="3"
                />
            </div>

            <div className="form-actions">
                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Question"}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;
