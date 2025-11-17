// ------------------------------------------------------
// Load dependencies
// ------------------------------------------------------
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// ------------------------------------------------------
// Connect to the SQLite database
// ------------------------------------------------------
const db = new sqlite3.Database("./university.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to university.db");
  }
});


// ------------------------------------------------------
// GET /api/courses - Return all courses
// ------------------------------------------------------
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM courses";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    res.json(rows);
  });
});


// ------------------------------------------------------
// GET /api/courses/:id - Return a course by ID
// ------------------------------------------------------
app.get("/api/courses/:id", (req, res) => {
  const sql = "SELECT * FROM courses WHERE id = ?";
  const params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json(row);
  });
});


// ------------------------------------------------------
// POST /api/courses - Add a new course
// ------------------------------------------------------
app.post("/api/courses", (req, res) => {
  console.log("POST Body:", req.body); // debug line

  const { courseCode, title, credits, description, semester } = req.body;

  if (!courseCode || !title || !credits || !semester) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sql = `
    INSERT INTO courses (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [courseCode, title, credits, description, semester], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error inserting course." });
    }

    res.status(201).json({
      message: "Course added successfully.",
      id: this.lastID
    });
  });
});



// ------------------------------------------------------
// PUT /api/courses/:id - Update existing course
// ------------------------------------------------------
app.put("/api/courses/:id", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?
  `;
  const params = [courseCode, title, credits, description, semester, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error updating course." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.json({ message: "Course updated successfully." });
  });
});


// ------------------------------------------------------
// DELETE /api/courses/:id - Delete course by ID
// ------------------------------------------------------
app.delete("/api/courses/:id", (req, res) => {
  const sql = "DELETE FROM courses WHERE id = ?";
  const params = [req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error deleting course." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.json({ message: "Course deleted successfully." });
  });
});


// ------------------------------------------------------
// Start the server
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
