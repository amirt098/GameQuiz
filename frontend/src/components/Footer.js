import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./../css/Footer.css";

const Footer = () => {
    const { darkMode } = useTheme();
    return (
        <footer className={`footer ${darkMode ? 'footer-dark' : 'footer-light'}`}>
            <p>&copy; Quiz Game Platform. Greetings and honor to all gamers.</p>
        </footer>
    );
};

export default Footer;