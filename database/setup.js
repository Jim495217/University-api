// ----------------------------------------
// Import sqlite3 package
// ----------------------------------------
const sqlite3 = require('sqlite3').verbose();

// ----------------------------------------
// Create (or open) the university.db file
// ----------------------------------------
const db = new sqlite3.Database('./university.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the university.db database.");
  }
});


db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT NOT NULL,
      title TEXT NOT NULL,
      credits INTEGER NOT NULL,
      description TEXT,
      semester TEXT NOT NULL
    );`,
    (err) => {
      if (err) {
        console.error("Error creating courses table:", err.message);
      } else {
        console.log("Courses table created successfully.");
      }
    }
  );
});


db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});
