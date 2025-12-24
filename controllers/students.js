import path from "path";
import fs from "fs/promises";
import { readCourses, readStudents, writeStudents } from "../utils/func.js";

const __dirname = path.resolve();

const STUDENTS_PATH =
  process.env.COURSES_PATH || path.join(__dirname, "data", "students.json");

export const getStudents = async (req, res) => {
  const students = await readStudents();
  res.send(students);
};
export const getStudentByID = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const students = await readStudents();
    const student = students.find((u) => u.id === id);

    if (!student) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ data: student });
    }
  } catch (err) {
    console.log(err);
  }
};
export const addStudent = async (req, res) => {
  try {
    const students = await  readStudents();
    const maxId =
      students.length > 0 ? Math.max(...students.map((u) => u.id)) : 0;
    const newStudent = {
      id: maxId + 1,
      ...req.body,
      enrolledCourses: [],
    };
    students.push(newStudent);

    await writeStudents(students);
    res.status(201).json({ data: newStudent });
  } catch (err) {
    console.log(err);
  }
};
export const updateStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const students = await readStudents();

    const index = students.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], id, ...req.body };
    //     const { id: _, ...body } = req.body;
    // users[index] = { ...users[index], ...body };

    await writeStudents(students);
    res.status(202).json({ updateUser: students[index] });
  } catch (err) {
    console.log(err);
  }
};
export const deleteStudentByID = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const students = await readStudents();

    const filtered = students.filter((u) => u.id != id);

    await writeStudents(filtered);
    students.length > filtered.length
      ? res.status(202).json({ msg: "student delete succefully" })
      : res.status(404).json({ msg: "student not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });

    console.log(err);
  }
};

export const addCourseToStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const sId = parseInt(studentId);
    const cId = parseInt(courseId);
    if (isNaN(sId) || isNaN(cId)) {
      return res
        .status(400)
        .json({ message: "Invalid student ID or course ID" });
    }
    const students = await readStudents();
    const studentIndex = students.findIndex((u) => u.id === sId);
    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = students[studentIndex];
    if (student.enrolledCourses.includes(cId)) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in this course" });
    }
    student.enrolledCourses.push(cId);
    students[studentIndex] = student;
    await writeStudents(students);
    res.status(200).json({ data: student });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};

export const deleteCourseToStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const sId = parseInt(studentId);
    const cId = parseInt(courseId);
    if (isNaN(sId) || isNaN(cId)) {
      return res
        .status(400)
        .json({ message: "Invalid student ID or course ID" });
    }
    const students = await readStudents();
    const studentIndex = students.findIndex((u) => u.id === sId);
    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = students[studentIndex];
    if (!student.enrolledCourses.includes(cId)) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this course" });
    }
    student.enrolledCourses = student.enrolledCourses.filter(
      (course) => course !== cId
    );
    students[studentIndex] = student;
    await writeStudents(students);
    res.status(200).json({ data: student });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};

export const getCoursesOfStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const sId = parseInt(studentId);
    if (isNaN(sId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const students = await readStudents();
    const student = students.find((u) => u.id === sId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const courses = await readCourses();
   
    const enrolledCourses = courses.filter((course) =>
      student.enrolledCourses.includes(course.id)
    );
    res.status(200).json({ data: enrolledCourses });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};


export const getStudentByName = async (req, res) => {
  const { name } = req.query;
  try {
    const students = await readStudents();
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(name.toLowerCase())
    );
    if (filteredStudents.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found with this name" });
    }
    res.status(200).json({ data: filteredStudents });
  } catch (err) {
    console.log(err);
    res.status(500).send("500 Internal Server Error");
  }
};
