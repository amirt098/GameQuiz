import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../css/DesignerHome.css";

const DesignerHome = () => {
    const { darkMode } = useTheme();
    
    return (
        <div className={`designer-home ${darkMode ? 'dark' : 'light'}`}>
            <h1>Welcome, Designer</h1>
            <div className="card-container">
                <Link to="/manage-questions" className="card">
                    <div className="card-icon">📝</div>
                    <h2>Manage Questions</h2>
                    <p>Create, edit, and organize your quiz questions</p>
                </Link>
                <Link to="/manage-categories" className="card">
                    <div className="card-icon">📁</div>
                    <h2>Manage Categories</h2>
                    <p>Organize and manage question categories</p>
                </Link>
            </div>
        </div>
    );
};

export default DesignerHome;
