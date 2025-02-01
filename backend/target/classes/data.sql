-- Clear existing data
DELETE FROM question_options;
DELETE FROM questions;
DELETE FROM users;

-- Insert users (password is 'password123' encoded with BCrypt)
INSERT INTO users (id, name, username, email, password, role, total_points)
VALUES 
    (1, 'John Admin', 'admin', 'admin@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/GiRYRhOcXF.KFhGW9.N6SqYgAi', 'admin', 0),
    (2, 'Sarah Player', 'player1', 'player1@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/GiRYRhOcXF.KFhGW9.N6SqYgAi', 'player', 100),
    (3, 'Mike Player', 'player2', 'player2@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/GiRYRhOcXF.KFhGW9.N6SqYgAi', 'player', 50);

-- Reset the sequence
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Insert questions by category
-- Mathematics Questions
INSERT INTO questions (id, title, text, category, difficulty, correct_answer, points, status)
VALUES 
    (1, 'Basic Addition', 'What is 2 + 2?', 'Mathematics', 'Easy', '4', 10, 'active'),
    (2, 'Basic Multiplication', 'What is 5 × 5?', 'Mathematics', 'Easy', '25', 10, 'active'),
    (3, 'Square Root', 'What is the square root of 16?', 'Mathematics', 'Medium', '4', 20, 'active'),
    (4, 'Algebra', 'Solve for x: 2x + 4 = 12', 'Mathematics', 'Medium', '4', 20, 'active');

-- Science Questions
INSERT INTO questions (id, title, text, category, difficulty, correct_answer, points, status)
VALUES 
    (5, 'Chemical Formula', 'What is the chemical formula for water?', 'Science', 'Easy', 'H2O', 10, 'active'),
    (6, 'Planet Distance', 'Which planet is closest to the Sun?', 'Science', 'Easy', 'Mercury', 10, 'active'),
    (7, 'Human Body', 'How many bones are in the human body?', 'Science', 'Medium', '206', 20, 'active'),
    (8, 'Cell Biology', 'What is the powerhouse of the cell?', 'Science', 'Medium', 'Mitochondria', 20, 'active');

-- History Questions
INSERT INTO questions (id, title, text, category, difficulty, correct_answer, points, status)
VALUES 
    (9, 'Ancient Egypt', 'Who was the first female pharaoh?', 'History', 'Medium', 'Hatshepsut', 20, 'active'),
    (10, 'World War II', 'In which year did World War II end?', 'History', 'Easy', '1945', 10, 'active'),
    (11, 'Ancient Rome', 'Who was the first Emperor of Rome?', 'History', 'Medium', 'Augustus', 20, 'active'),
    (12, 'US History', 'Who was the first President of the United States?', 'History', 'Easy', 'George Washington', 10, 'active');

-- Geography Questions
INSERT INTO questions (id, title, text, category, difficulty, correct_answer, points, status)
VALUES 
    (13, 'World Capitals', 'What is the capital of France?', 'Geography', 'Easy', 'Paris', 10, 'active'),
    (14, 'Mountains', 'What is the highest mountain in the world?', 'Geography', 'Easy', 'Mount Everest', 10, 'active'),
    (15, 'Rivers', 'What is the longest river in the world?', 'Geography', 'Medium', 'Nile', 20, 'active'),
    (16, 'Continents', 'What is the smallest continent by land area?', 'Geography', 'Medium', 'Australia', 20, 'active');

-- Reset the sequence
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

-- Insert options for Mathematics questions
INSERT INTO question_options (question_id, options) VALUES
    (1, '3'), (1, '4'), (1, '5'), (1, '6'),
    (2, '20'), (2, '25'), (2, '30'), (2, '35'),
    (3, '2'), (3, '3'), (3, '4'), (3, '5'),
    (4, '2'), (4, '3'), (4, '4'), (4, '5');

-- Insert options for Science questions
INSERT INTO question_options (question_id, options) VALUES
    (5, 'H2O'), (5, 'CO2'), (5, 'O2'), (5, 'N2'),
    (6, 'Venus'), (6, 'Mercury'), (6, 'Earth'), (6, 'Mars'),
    (7, '186'), (7, '196'), (7, '206'), (7, '216'),
    (8, 'Nucleus'), (8, 'Mitochondria'), (8, 'Ribosome'), (8, 'Golgi Body');

-- Insert options for History questions
INSERT INTO question_options (question_id, options) VALUES
    (9, 'Cleopatra'), (9, 'Nefertiti'), (9, 'Hatshepsut'), (9, 'Isis'),
    (10, '1943'), (10, '1944'), (10, '1945'), (10, '1946'),
    (11, 'Julius Caesar'), (11, 'Augustus'), (11, 'Nero'), (11, 'Caligula'),
    (12, 'Thomas Jefferson'), (12, 'John Adams'), (12, 'George Washington'), (12, 'Benjamin Franklin');

-- Insert options for Geography questions
INSERT INTO question_options (question_id, options) VALUES
    (13, 'London'), (13, 'Paris'), (13, 'Berlin'), (13, 'Madrid'),
    (14, 'K2'), (14, 'Mount Everest'), (14, 'Mount Kilimanjaro'), (14, 'Mount McKinley'),
    (15, 'Amazon'), (15, 'Nile'), (15, 'Mississippi'), (15, 'Yangtze'),
    (16, 'Europe'), (16, 'Australia'), (16, 'Antarctica'), (16, 'Africa');
