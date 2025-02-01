// Mock data

import api from './axiosConfig';

export const login = async (emailOrUsername, password) => {
    try {
        const response = await api.post('/auth/login', {
            emailOrUsername,
            password
        });
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'An error occurred during login'
        };
    }
};

export const signup = async (userData) => {
    try {
        console.log('Attempting signup with data:', userData);
        const response = await api.post('/auth/signup', userData);
        console.log('Signup response:', response);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Signup error:', error);
        console.error('Error response:', error.response);
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.error || 'An error occurred during signup'
        };
    }
};

export const getUserProfile = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get(`/users/${userId}`, config);
        return {
            status: 200,
            profile: response.data
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to fetch user profile'
        };
    }
};

export const updateUserProfile = async (userId, userData) => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return {
            status: 200,
            profile: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to update user profile'
        };
    }
};

// Question APIs
export const getQuestions = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.status) params.append('status', filters.status);
        if (filters.designer) params.append('designer', filters.designer);

        const response = await api.get('/questions', { params });
        return {
            status: 200,
            data: response.data.questions || [] // Changed to access response.data.questions
        };
    } catch (error) {
        console.error('Get questions error:', error);
        return {
            status: error.response?.status || 500,
            error: error.message,
            data: []
        };
    }
};
export const createQuestion = async (questionData) => {
    try {
        const response = await api.post('/questions', questionData);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Create question error:', error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || error.message || 'Failed to create question'
        };
    }
};

export const updateQuestion = async (questionId, questionData) => {
    try {
        const response = await api.put(`/questions/${questionId}`, questionData);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Update question error:', error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || error.message || 'Failed to update question'
        };
    }
};

export const deleteQuestion = async (questionId) => {
    try {
        const response = await api.delete(`/questions/${questionId}`);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to delete question'
        };
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to fetch categories'
        };
    }
};

export const addCategory = async (category) => {
    try {
        const response = await api.post('/categories', { name: category });
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to add category'
        };
    }
};

export const updateCategory = async (oldName, newName) => {
    try {
        const response = await api.put(`/categories/${oldName}`, { name: newName });
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to update category'
        };
    }
};

export const deleteCategory = async (categoryName) => {
    try {
        const response = await api.delete(`/categories/${categoryName}`);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to delete category'
        };
    }
};

export const getLeaderboard = async () => {
    try {
        console.log('Fetching leaderboard...');
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get('/leaderboard', config);
        console.log('Raw API response:', response);
        
        // Ensure we have a valid response with players array
        if (response?.data?.players && Array.isArray(response.data.players)) {
            return {
                status: 200,
                data: response.data.players
            };
        } else {
            console.error('Invalid leaderboard response format:', response.data);
            return {
                status: 500,
                error: 'Invalid response format',
                data: []
            };
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || 'Failed to fetch leaderboard',
            data: []
        };
    }
};

export const getRandomQuestion = async () => {
    try {
        const response = await api.get('/questions/random');
        return {
            status: 200,
            data: response.data.question || null  // Access the question from the response structure
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to fetch random question',
            data: null
        };
    }
};
export const getQuestionsByCategory = async (category) => {
    try {
        const response = await api.get(`/questions/category/${category}`);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data || 'Failed to fetch questions by category',
            data: []
        };
    }
};

export const submitAnswer = async (questionId, answer) => {
    try {
        console.log('Submitting answer:', { questionId, answer });
        const response = await api.post(`/questions/${questionId}/submit`, { answer });
        console.log('Submit answer response:', response.data);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Submit answer error:', {
            status: error.response?.status,
            data: error.response?.data,
            error: error.message
        });
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || 'Failed to submit answer'
        };
    }
};

export const saveUserAnswer = async (userId, questionId, selectedAnswer, isCorrect, points) => {
    try {
        const response = await api.post(`/users/${userId}/answers`, {
            questionId,
            selectedAnswer,
            isCorrect,
            points,
            answeredAt: new Date().toISOString()
        });
        return {
            status: 200,
            userAnswer: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || 'Failed to save user answer'
        };
    }
};

// User Profile APIs
export const getUserAnsweredQuestions = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/answers`);
        return response.data;
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || 'Failed to fetch user answered questions'
        };
    }
};

export const getRandomUnansweredQuestion = async (userId) => {
    try {
        console.log('Fetching random unanswered question for user:', userId);
        const response = await api.get(`/questions/random/unanswered/${userId}`);
        console.log('Random question response:', response.data);
        return {
            status: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Error fetching random question:', {
            status: error.response?.status,
            data: error.response?.data,
            error: error.message
        });
        return {
            status: error.response?.status || 500,
            error: error.response?.data?.message || 'No more questions available'
        };
    }
};
