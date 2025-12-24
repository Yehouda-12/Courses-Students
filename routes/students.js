import express from "express";
import {getStudentByID,addStudent, getStudents, updateStudent, deleteStudentByID, addCourseToStudent, deleteCourseToStudent, getCoursesOfStudent, getStudentByName} from '../controllers/students.js'

const router = express.Router()
router.route("/").get(getStudents).post(addStudent)
router.route("/search").get(getStudentByName)
router.route("/:id").get(getStudentByID).put(updateStudent).delete(deleteStudentByID)
router.route("/:studentId/enroll/:courseId").post(addCourseToStudent)
router.route("/:studentId/unenroll/:courseId").delete(deleteCourseToStudent)
router.route("/:studentId/courses").get(getCoursesOfStudent)



export default router

