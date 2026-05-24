const pool = require("../db");

const createStudent = async (req, res) => {
  try {

    const {
      name, email, age, subject, score,
    } = req.body;

    let studentResult = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    let student = studentResult.rows[0];

    if (!student) {
      studentResult = await pool.query(
        `INSERT INTO students(name, email, age)
         VALUES($1, $2, $3)
         RETURNING *`,
        [name, email, age]
      );

      student = studentResult.rows[0];
    }

    const existingMark = await pool.query(
      `SELECT id FROM marks
       WHERE student_id = $1
         AND LOWER(subject) = LOWER($2)`,
      [student.id, subject]
    );

    if (existingMark.rows.length > 0) {
      return res.status(409).json({
        message: "Marks already exist for this student and subject",
      });
    }

    await pool.query(
      `INSERT INTO marks(student_id, subject, score)
       VALUES($1, $2, $3)`,
      [student.id, subject, score]
    );

    res.status(201).json({
      message: "Student and marks added successfully",
      student,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error creating student",
    });
  }
};


const getStudents = async (req, res) => {
  try {

    const page = parseInt(req.query.page) ;

    const limit = parseInt(req.query.limit) ;

    const offset = (page - 1) * limit;

    const students = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.age,
         m.id AS mark_id,
         m.subject,
         m.score
       FROM students s
       LEFT JOIN marks m
         ON s.id = m.student_id
       ORDER BY s.id ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const totalStudents = await pool.query(
      `SELECT COUNT(*)
       FROM students s
       LEFT JOIN marks m
         ON s.id = m.student_id`
    );

    res.json({
      total: parseInt(totalStudents.rows[0].count),
      page, limit,
      data: students.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error fetching students",
    });
  }
};
const getStudentById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.age,
         m.id AS mark_id,
         m.subject,
         m.score
       FROM students s
       LEFT JOIN marks m
         ON s.id = m.student_id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error fetching student",
    });
  }
};

const updateStudent = async (req, res) => {
  try {

    const { id } = req.params;

    const { mark_id, name, email, age, subject, score } = req.body;

    const result = await pool.query(
      `UPDATE students
       SET name = $1,
           email = $2,
           age = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, age, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const marksResult = mark_id
      ? await pool.query(
        `UPDATE marks
         SET subject = $1,
             score = $2
         WHERE id = $3
           AND student_id = $4`,
        [subject, score, mark_id, id]
      )
      : await pool.query(
        `UPDATE marks
         SET subject = $1,
             score = $2
         WHERE student_id = $3`,
        [subject, score, id]
      );

    if (marksResult.rowCount === 0) {
      await pool.query(
        `INSERT INTO marks(student_id, subject, score)
         VALUES($1, $2, $3)`,
        [id, subject, score]
      );
    }

    const updatedStudent = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.age,
         m.id AS mark_id,
         m.subject,
         m.score
       FROM students s
       LEFT JOIN marks m
         ON s.id = m.student_id
       WHERE s.id = $1
         AND ($2::int IS NULL OR m.id = $2)`,
      [id, mark_id || null]
    );

    res.json({
      message: "Student updated successfully",
      student: updatedStudent.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error updating student",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM marks WHERE student_id = $1",
      [id]
    );

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
      deletedStudent: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error deleting student",
    });
  }
};

module.exports = {
  createStudent, getStudents, getStudentById,
  updateStudent,deleteStudent,
};
