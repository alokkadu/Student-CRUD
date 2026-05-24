CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT NOT NULL
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,

    student_id INT NOT NULL,

    subject VARCHAR(100) NOT NULL,

    score INT NOT NULL,

    FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON DELETE CASCADE,

    UNIQUE(student_id, subject)
);

-- Sample Students
INSERT INTO students (name, email, age)
VALUES
('Alok', 'alok@gmail.com', 24),
('Rohan', 'rohan@gmail.com', 22),
('Rahul', 'rahul@gmail.com', 23);

-- Sample Marks
INSERT INTO marks (student_id, subject, score)
VALUES
(1, 'Math', 90),
(2, 'Science', 85),
(3, 'English', 88);
