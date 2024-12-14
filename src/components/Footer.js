import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./../css/Footer.css";

const Footer = () => {
    const { darkMode } = useTheme();
    return (
        <footer className={`footer ${darkMode ? 'footer-dark' : 'footer-light'}`}>
            <p>&copy; 2024 Interactive Game Platform. All rights reserved.</p>
        </footer>
    );
};

export default Footer;