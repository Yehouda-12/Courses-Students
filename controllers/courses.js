import path from "path";
import fs from "fs/promises";
import { readCourses, readStudents, writeCourses,getByCreditRange,getByNameInstructor } from "../utils/func.js";
import { CLIENT_RENEG_LIMIT } from "tls";

const __dirname = path.resolve();

const COURSES_PATH =
  process.env.COURSES_PATH || path.join(__dirname, "data", "courses.json");

export const getCourses = async (req, res) => {
  const courses = await readCourses();
  res.send(courses);
};
export const getCoursesByID = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const courses = await readCourses();

    const course = courses.find((u) => u.id === id);

    if (!course) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: course });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addCourse = async (req, res) => {
  try {
    const courses = readCourses();
    const maxId =
      courses.length > 0 ? Math.max(...courses.map((u) => u.id)) : 0;
    const newCourse = {
      id: maxId + 1,
      ...req.body,
    };
    courses.push(newCourse);

    await writeCourses(courses);
    res.status(201).json({ data: newCourse });
  } catch (err) {
    console.log(err);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const courses = await readCourses();

    const index = courses.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    courses[index] = { ...courses[index], id, ...req.body };
    //     const { id: _, ...body } = req.body;
    // users[index] = { ...users[index], ...body };

    await writeCourses(courses);
    res.status(202).json({ updateUser: courses[index] });
  } catch (err) {
    console.log(err);
  }
};
export const deleteCourseByID = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const courses = await readCourses();

    const filtered = courses.filter((u) => u.id != id);

    await writeCourses(filtered);
    courses.length > filtered.length
      ? res.status(202).json({ msg: "student delete succefully" })
      : res.status(404).json({ msg: "student not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });

    console.log(err);
  }
};

export const getStudentsOfCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    const courses = await readCourses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const students = await readStudents();
    const enrolledStudents = students.filter((s) =>
      s.enrolledCourses.includes(courseId)
    );
    res.status(200).json({ data: enrolledStudents });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.log(err);
  }
};

export const getCourseByInstructor = async (req, res) => {
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

export const getCoursesByType = async (req, res) => {
  const { instructor } = req.query;
  const minCredits = parseInt(req.query.minCredits);
  const maxCredits = parseInt(req.query.maxCredits);

  if (maxCredits && minCredits) getByCreditRange(req, res);
  else if (instructor) getByNameInstructor(req, res);
  else if ((minCredits && !maxCredits) || (!minCredits && maxCredits)) {
    return res.status(400).json({
      error: "mincredit et maxcredit must given together",
    });
  }
};
