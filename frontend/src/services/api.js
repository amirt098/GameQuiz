// Mock data
const mockData = {
    users: [
        { 
            id: 1, 
            email: "designer@example.com",
            role: "designer",
            name: "Designer User"
        },
        { 
            id: 2, 
            email: "player@example.com",
            role: "player",
            name: "Player User"
        },
        {
            id: 3,
            email: "player2@example.com",
            role: "player",
            name: "John Doe"
        },
        {
            id: 4,
            email: "player3@example.com",
            role: "player",
            name: "Jane Smith"
        },
        {
            id: 5,
            email: "amir0tohidi@gmail.com",
            role: "player",
            name: "Amir Tohidi"
        }
    ],
    leaderboard: [
        {
            name: "John Doe",
            score: 850
        },
        {
            name: "Jane Smith",
            score: 720
        },
        {
            name: "Alex Johnson",
            score: 695
        },
        {
            name: "Sarah Wilson",
            score: 560
        },
        {
            name: "Mike Brown",
            score: 455
        }
    ],
    questions: [
        {
            id: 1,
            title: "JavaScript Basics",
            question: "What is the difference between 'let' and 'var' in JavaScript?",
            difficulty: "medium",
            category: "Computer Science",
            options: [
                "'let' is block-scoped, 'var' is function-scoped",
                "'let' can be redeclared, 'var' cannot",
                "'let' is newer than 'var'",
                "There is no difference"
            ],
            correctAnswer: 0,
            points: 10
        },
        {
            id: 2,
            title: "World History",
            question: "Who was the first president of the United States?",
            difficulty: "easy",
            category: "History",
            options: [
                "Thomas Jefferson",
                "George Washington",
                "John Adams",
                "Benjamin Franklin"
            ],
        
            correctAnswer: 1,
            points: 5
        },
        {
            id: 3,
            title: "Physics Laws",
            question: "What is Newton's first law of motion?",
            difficulty: "hard",
            category: "Physics",
            options: [
                "Force equals mass times acceleration",
                "For every action, there is an equal and opposite reaction",
                "An object at rest stays at rest unless acted upon by a force",
                "Energy cannot be created or destroyed"
            ],
            correctAnswer: 2,
            points: 15
        },
        {
            id: 4,
            title: "React Hooks",
            question: "Explain the purpose of useEffect hook in React.",
            difficulty: "hard",
            category: "Computer Science",
            designer: "Designer User",
            createdAt: "2024-01-18",
            status: "active"
        },
        {
            id: 5,
            title: "SQL Basics",
            question: "What is the difference between INNER JOIN and LEFT JOIN?",
            difficulty: "medium",
            category: "Computer Science",
            designer: "Designer User",
            createdAt: "2024-01-19",
            status: "archived"
        },
        {
            id: 6,
            title: "Ancient Civilizations",
            question: "Describe the major achievements of the Roman Empire.",
            difficulty: "medium",
            category: "History",
            designer: "Designer User",
            createdAt: "2024-01-20",
            status: "pending"
        }
    ],
    categories: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "History",
        "Geography",
        "Literature",
        "Art",
        "Music"
    ]
};

const mockQuestions = [
    // Programming Category
    {
        id: 1,
        title: "JavaScript Basics",
        question: "What is the difference between 'let' and 'var' in JavaScript?",
        difficulty: "medium",
        category: "Programming",
        designer: "Designer User",
        status: "active",
        options: [
            "'let' is block-scoped, 'var' is function-scoped",
            "'let' can be redeclared, 'var' cannot",
            "'let' is newer than 'var'",
            "There is no difference"
        ],
        correctAnswer: 0,
        points: 10
    },
    {
        id: 4,
        title: "SQL Basics",
        question: "Which SQL command is used to retrieve data from a database?",
        difficulty: "easy",
        category: "Programming",
        designer: "Designer User",
        status: "active",
        options: [
            "GET",
            "FETCH",
            "SELECT",
            "RETRIEVE"
        ],
        correctAnswer: 2,
        points: 5
    },
    {
        id: 7,
        title: "React Hooks",
        question: "Which hook is used for side effects in React?",
        difficulty: "hard",
        category: "Programming",
        designer: "Designer User",
        status: "active",
        options: [
            "useState",
            "useEffect",
            "useContext",
            "useReducer"
        ],
        correctAnswer: 1,
        points: 15
    },

    // History Category
    {
        id: 2,
        title: "World History",
        question: "Who was the first president of the United States?",
        difficulty: "easy",
        category: "History",
        designer: "John Doe",
        status: "active",
        options: [
            "Thomas Jefferson",
            "George Washington",
            "John Adams",
            "Benjamin Franklin"
        ],
        
        correctAnswer: 1,
        points: 5
    },
    {
        id: 5,
        title: "Ancient Egypt",
        question: "Which ancient wonder was located in Egypt?",
        difficulty: "medium",
        category: "History",
        designer: "Jane Smith",
        status: "active",
        options: [
            "Hanging Gardens",
            "Great Pyramid of Giza",
            "Colossus of Rhodes",
            "Temple of Artemis"
        ],
        correctAnswer: 1,
        points: 10
    },
    {
        id: 8,
        title: "World War II",
        question: "In which year did World War II end?",
        difficulty: "medium",
        category: "History",
        designer: "Designer User",
        status: "active",
        options: [
            "1943",
            "1944",
            "1945",
            "1946"
        ],
        correctAnswer: 2,
        points: 10
    },

    // Science Category
    {
        id: 3,
        title: "Physics Laws",
        question: "What is Newton's first law of motion?",
        difficulty: "hard",
        category: "Science",
        designer: "Designer User",
        status: "active",
        options: [
            "Force equals mass times acceleration",
            "For every action, there is an equal and opposite reaction",
            "An object at rest stays at rest unless acted upon by a force",
            "Energy cannot be created or destroyed"
        ],
        correctAnswer: 2,
        points: 15
    },
    {
        id: 6,
        title: "Chemistry",
        question: "What is the atomic number of Carbon?",
        difficulty: "medium",
        category: "Science",
        designer: "Designer User",
        status: "active",
        options: [
            "4",
            "6",
            "8",
            "12"
        ],
        correctAnswer: 1,
        points: 10
    },
    {
        id: 9,
        title: "Biology",
        question: "What is the powerhouse of the cell?",
        difficulty: "easy",
        category: "Science",
        designer: "Designer User",
        status: "active",
        options: [
            "Nucleus",
            "Mitochondria",
            "Endoplasmic Reticulum",
            "Golgi Apparatus"
        ],
        correctAnswer: 1,
        points: 5
    },

    // Mathematics Category
    {
        id: 10,
        title: "Basic Algebra",
        question: "Solve for x: 2x + 5 = 13",
        difficulty: "easy",
        category: "Mathematics",
        designer: "Designer User",
        status: "active",
        options: [
            "x = 3",
            "x = 4",
            "x = 5",
            "x = 6"
        ],
        correctAnswer: 1,
        points: 5
    },
    {
        id: 11,
        title: "Geometry",
        question: "What is the sum of angles in a triangle?",
        difficulty: "easy",
        category: "Mathematics",
        designer: "Designer User",
        status: "active",
        options: [
            "90 degrees",
            "180 degrees",
            "270 degrees",
            "360 degrees"
        ],
        correctAnswer: 1,
        points: 5
    },
    {
        id: 12,
        title: "Calculus",
        question: "What is the derivative of x²?",
        difficulty: "medium",
        category: "Mathematics",
        designer: "Designer User",
        status: "active",
        options: [
            "x",
            "2x",
            "x²",
            "2"
        ],
        correctAnswer: 1,
        points: 10
    },

    // Geography Category
    {
        id: 13,
        title: "World Capitals",
        question: "What is the capital of Japan?",
        difficulty: "easy",
        category: "Geography",
        designer: "Designer User",
        status: "active",
        options: [
            "Seoul",
            "Beijing",
            "Tokyo",
            "Bangkok"
        ],
        correctAnswer: 2,
        points: 5
    },
    {
        id: 14,
        title: "World Rivers",
        question: "Which is the longest river in the world?",
        difficulty: "medium",
        category: "Geography",
        designer: "Designer User",
        status: "active",
        options: [
            "Amazon",
            "Nile",
            "Mississippi",
            "Yangtze"
        ],
        correctAnswer: 1,
        points: 10
    },
    {
        id: 15,
        title: "Mountains",
        question: "Which mountain range is the longest in the world?",
        difficulty: "hard",
        category: "Geography",
        designer: "Designer User",
        status: "active",
        options: [
            "Rocky Mountains",
            "Himalayas",
            "Andes",
            "Alps"
        ],
        correctAnswer: 2,
        points: 15
    },

    // Literature Category
    {
        id: 16,
        title: "Shakespeare",
        question: "Who wrote 'Romeo and Juliet'?",
        difficulty: "easy",
        category: "Literature",
        designer: "Designer User",
        status: "active",
        options: [
            "Charles Dickens",
            "William Shakespeare",
            "Jane Austen",
            "Mark Twain"
        ],
        correctAnswer: 1,
        points: 5
    },
    {
        id: 17,
        title: "Classic Novels",
        question: "Who wrote '1984'?",
        difficulty: "medium",
        category: "Literature",
        designer: "Designer User",
        status: "active",
        options: [
            "George Orwell",
            "Aldous Huxley",
            "Ray Bradbury",
            "Ernest Hemingway"
        ],
        correctAnswer: 0,
        points: 10
    },
    {
        id: 18,
        title: "Poetry",
        question: "What is a haiku's traditional syllable pattern?",
        difficulty: "hard",
        category: "Literature",
        designer: "Designer User",
        status: "active",
        options: [
            "5-7-5",
            "7-5-7",
            "5-5-7",
            "7-7-5"
        ],
        correctAnswer: 0,
        points: 15
    }
];

// Mock user answered questions data
const mockUserAnswers = {
    "user123": [
        {
            questionId: 1,
            answeredAt: "2024-12-14T21:20:00",
            selectedAnswer: 0,
            isCorrect: true,
            points: 10,
            category: "Programming"
        },
        {
            questionId: 5,
            answeredAt: "2024-12-14T21:25:00",
            selectedAnswer: 1,
            isCorrect: false,
            points: 0,
            category: "History"
        }
    ]
};

// Mock user profiles
const mockProfiles = {
    "user123": {
        id: "user123",
        username: "John Player",
        role: "player",
        email: "john@example.com",
        joinedDate: "2024-01-01",
        totalPoints: 1250,
        gamesPlayed: 45,
        correctAnswers: 38
    },
    "designer123": {
        id: "designer123",
        username: "Sarah Designer",
        role: "designer",
        email: "sarah@example.com",
        joinedDate: "2024-01-01",
        questionsCreated: 25,
        categoriesCreated: ["Computer Science", "Mathematics", "Physics"],
        topQuestions: [
            {
                id: 1,
                title: "JavaScript Promises",
                plays: 50,
                successRate: 85
            },
            {
                id: 2,
                title: "React Hooks",
                plays: 45,
                successRate: 78
            }
        ]
    }
};

// Authentication APIs
export const login = async (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockData.users.find(u => u.email === email);
            if (user) {
                // Simulating a successful login response from backend
                resolve({
                    status: 200,
                    data: {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        },
                        token: "mock-jwt-token-" + user.id
                    }
                });
            } else {
                // Simulating an error response
                resolve({
                    status: 401,
                    error: "Invalid credentials"
                });
            }
        }, 500);
    });
};

export const signup = async (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if email already exists
            const existingUser = mockData.users.find(u => u.email === userData.email);
            if (existingUser) {
                resolve({
                    status: 400,
                    error: "Email already exists"
                });
            } else {
                // Simulate successful registration
                const newUser = {
                    id: mockData.users.length + 1,
                    ...userData
                };
                resolve({
                    status: 200,
                    data: {
                        user: {
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                            role: newUser.role
                        },
                        token: "mock-jwt-token-" + newUser.id
                    }
                });
            }
        }, 500);
    });
};

// Question APIs
export const getQuestions = async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredQuestions = [...mockQuestions];

    // Apply filters
    if (filters.category) {
        filteredQuestions = filteredQuestions.filter(q => 
            q.category?.toLowerCase() === filters.category.toLowerCase()
        );
    }

    if (filters.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => 
            q.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
        );
    }

    // Handle designer filter based on showAllQuestions
    if (filters.designer && !filters.showAllQuestions) {
        filteredQuestions = filteredQuestions.filter(q => 
            q.designer?.toLowerCase() === filters.designer.toLowerCase()
        );
    }

    if (filters.status) {
        filteredQuestions = filteredQuestions.filter(q => 
            (q.status || 'active').toLowerCase() === filters.status.toLowerCase()
        );
    }

    return {
        questions: filteredQuestions,
        total: filteredQuestions.length
    };
};

export const createQuestion = async (questionData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newQuestion = {
        id: mockData.questions.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        ...questionData
    };
    mockData.questions.push(newQuestion);
    return { success: true, question: newQuestion };
};

// Category APIs
export const getCategories = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const categories = [...new Set(mockQuestions.map(q => q.category))];
            resolve(categories);
        }, 500);
    });
};

export const addCategory = async (category) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!mockData.categories.includes(category)) {
        mockData.categories.push(category);
        return { success: true, categories: mockData.categories };
    }
    return { success: false, message: "Category already exists" };
};

export const updateCategory = async (oldName, newName) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.categories.indexOf(oldName);
    if (index !== -1 && !mockData.categories.includes(newName)) {
        mockData.categories[index] = newName;
        return { success: true, categories: mockData.categories };
    }
    return { success: false, message: "Category not found or new name already exists" };
};

export const deleteCategory = async (categoryName) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.categories.indexOf(categoryName);
    if (index !== -1) {
        mockData.categories.splice(index, 1);
        return { success: true, categories: mockData.categories };
    }
    return { success: false, message: "Category not found" };
};

// Leaderboard API
export const getLeaderboard = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData.leaderboard);
        }, 500);
    });
};

// Game APIs
export const getRandomQuestion = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * mockQuestions.length);
            resolve(mockQuestions[randomIndex]);
        }, 500);
    });
};

export const getQuestionsByCategory = async (category) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const questions = mockQuestions.filter(q => q.category === category);
            resolve(questions);
        }, 500);
    });
};

export const submitAnswer = async (questionId, answer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const question = mockQuestions.find(q => q.id === questionId);
            const isCorrect = question.correctAnswer === answer;
            resolve({
                correct: isCorrect,
                points: isCorrect ? question.points : 0,
                correctAnswer: question.correctAnswer,
                explanation: `The correct answer is: ${question.options[question.correctAnswer]}`
            });
        }, 500);
    });
};

// Function to get user's answered questions history
export const getUserAnsweredQuestions = async (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userAnswers = mockUserAnswers[userId] || [];
            const answeredQuestions = userAnswers.map(answer => {
                const question = mockQuestions.find(q => q.id === answer.questionId);
                return {
                    ...question,
                    answeredAt: answer.answeredAt,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect: answer.isCorrect,
                    earnedPoints: answer.points
                };
            });
            resolve(answeredQuestions);
        }, 500);
    });
};

// Function to save user's answer
export const saveUserAnswer = async (userId, questionId, selectedAnswer, isCorrect, points) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!mockUserAnswers[userId]) {
                mockUserAnswers[userId] = [];
            }
            
            const question = mockQuestions.find(q => q.id === questionId);
            const newAnswer = {
                questionId,
                answeredAt: new Date().toISOString(),
                selectedAnswer,
                isCorrect,
                points: isCorrect ? points : 0,
                category: question.category
            };
            
            mockUserAnswers[userId].push(newAnswer);
            resolve(newAnswer);
        }, 500);
    });
};

// Get user profile
export const getUserProfile = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const profile = mockProfiles[userId];
    if (!profile) {
        throw new Error('Profile not found');
    }
    return profile;
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    if (!mockProfiles[userId]) {
        throw new Error('Profile not found');
    }
    mockProfiles[userId] = {
        ...mockProfiles[userId],
        ...updates
    };
    return mockProfiles[userId];
};
