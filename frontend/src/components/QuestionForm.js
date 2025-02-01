import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createQuestion, updateQuestion, getCategories } from "../services/api";
import "../css/QuestionForm.css";

const QuestionForm = ({ onSubmit, initialData = null }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        text: "",
        category: "",
        difficulty: "easy",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 0,
        status: "active"
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                options: initialData.options || ["", "", "", ""]
            });
        }
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response?.status === 200 && response.data) {
                    const categoryList = Array.isArray(response.data.categories) 
                        ? response.data.categories.map(cat => typeof cat === 'object' ? cat.name : cat)
                        : [];
                    setCategories(categoryList);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategories([]);
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
                status: "active"
            };

            const response = initialData 
                ? await updateQuestion(initialData.id, questionData)
                : await createQuestion(questionData);

            if (response?.status === 200 && response.data?.question) {
                onSubmit?.(response.data.question);
                if (!initialData) {
                    setFormData({
                        title: "",
                        text: "",
                        category: "",
                        difficulty: "easy",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                        points: 0,
                        status: "active"
                    });
                }
            } else {
                const errorMessage = response?.error || "Failed to save question";
                setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
            }
        } catch (err) {
            console.error("Error saving question:", err);
            const errorMessage = err?.response?.data || err.message || "Failed to save question. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="question-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="text">Question Text</label>
                <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                />
            </div>

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
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
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

            <div className="form-group">
                <label>Options</label>
                {formData.options.map((option, index) => (
                    <div key={index} className="option-group">
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                        <input
                            type="radio"
                            name="correctAnswer"
                            value={option}
                            checked={formData.correctAnswer === option}
                            onChange={(e) => handleChange({
                                target: { name: 'correctAnswer', value: e.target.value }
                            })}
                            required
                        />
                    </div>
                ))}
            </div>

            <div className="form-group">
                <label htmlFor="points">Points</label>
                <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : (initialData ? "Update Question" : "Create Question")}
            </button>
        </form>
    );
};

export default QuestionForm;
