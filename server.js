import express from "express";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv"
import students from './routes/students.js'
import courses from './routes/courses.js'

const app = express();
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000;
// const TODOS_PATH = process.env.TODOS_PATH || path.join(__dirname, "data", "users.json");

dotenv.config({path:".env"})
app.use(express.json());



app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/students',students)
app.use('/courses',courses)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

