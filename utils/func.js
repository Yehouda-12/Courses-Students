import path from "path";
import fs from "fs/promises";

const __dirname = path.resolve();
const STUDENTS_PATH =
  process.env.STUDENTS_PATH || path.join(__dirname, "data", "students.json");
const COURSES_PATH =
  process.env.COURSES_PATH || path.join(__dirname, "data", "courses.json");

const readFromFile = async (path) => {
  try {
    const students = JSON.parse(await fs.readFile(path, "utf-8"));
    return students;
  } catch (error) {
    return [];
  }
};

export async function readStudents() {
  return await readFromFile(STUDENTS_PATH);
}

export async function writeStudents(students) {
  await fs.writeFile(STUDENTS_PATH, JSON.stringify(students, null, 2), "utf-8");
}

export async function readCourses() {
  return await readFromFile(COURSES_PATH);
}

export async function writeCourses(courses) {
  await fs.writeFile(COURSES_PATH, JSON.stringify(courses, null, 2), "utf-8");
}

export const getByNameInstructor = async (req, res) => {
  const { instructor } = req.query;
  try {
    const courses = await readCourses();
    const filteredCourses = courses.filter((student) =>
      student.instructor.toLowerCase().includes(instructor.toLowerCase())
    );
    if (filteredCourses.length === 0) {
      return res
        .status(404)
        .json({ message: "No course found with this instructor" });
    }
    res.status(200).json({ data: filteredCourses });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};

export const getByCreditRange = async ( req, res) => {
  const minCredits = parseInt(req.query.minCredits);
  const maxCredits = parseInt(req.query.maxCredits);

  try {
    const courses = await readCourses();
    if (minCredits > maxCredits) {
      return res.status(400).json({
        error: "mincredit cannot be greater than maxcredit",
      });
    }
    const filteredCourses = courses.filter(
      (course) => course.credits >= minCredits && course.credits <= maxCredits
    );
    if (filteredCourses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found in this credit range" });
    }
    res.status(200).json({ data: filteredCourses });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};