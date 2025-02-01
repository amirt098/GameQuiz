import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateQuestion from "./pages/CreateQuestion";
import PlayGame from "./pages/PlayGame";
import ProfilePage from "./pages/ProfilePage";
import ManageCategories from "./pages/ManageCategories";
import DesignerHome from "./pages/DesignerHome";
import PlayerHome from "./pages/PlayerHome";
import ManageQuestions from "./pages/ManageQuestions";
import LeaderboardPage from "./pages/LeaderboardPage";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
    const { darkMode } = useTheme();
    const { user } = useAuth();

    const HomeRedirect = () => {
        if (!user) return <Home />;
        const role = user?.role?.toLowerCase() || 'player';
        return <Navigate to={`/${role}-home`} replace />;
    };

    return (
        <div className={darkMode ? "app dark-mode" : "app"}>
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/login" element={
                            user ? <Navigate to={`/${user?.role?.toLowerCase() || 'player'}-home`} replace /> : <Login />
                        } />
                        <Route path="/signup" element={
                            user ? <Navigate to={`/${user?.role?.toLowerCase() || 'player'}-home`} replace /> : <Signup />
                        } />
                        <Route path="/designer-home" 
                            element={<PrivateRoute element={<DesignerHome />} requiredRole="designer" />} 
                        />
                        <Route path="/player-home" 
                            element={<PrivateRoute element={<PlayerHome />} requiredRole="player" />} 
                        />
                        <Route path="/manage-questions" 
                            element={<PrivateRoute element={<ManageQuestions />} requiredRole="designer" />} 
                        />
                        <Route path="/create-question" 
                            element={<PrivateRoute element={<CreateQuestion />} requiredRole="designer" />} 
                        />
                        <Route path="/play-game" 
                            element={<PrivateRoute element={<PlayGame />} requiredRole="player" />} 
                        />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/profile" 
                            element={<PrivateRoute element={<ProfilePage />} />} 
                        />
                        <Route path="/manage-categories" 
                            element={<PrivateRoute element={<ManageCategories />} requiredRole="designer" />} 
                        />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;