const express = require("express");
const cors = require("cors");
const pool = require("./db");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Database connection error");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});