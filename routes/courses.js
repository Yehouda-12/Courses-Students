import express from "express";
import {addCourse, deleteCourseByID, getCourses, getCoursesByID, getCoursesByType, getStudentsOfCourse, updateCourse} from '../controllers/courses.js'

const router = express.Router()
router.route("/").get(getCourses).post(addCourse)
router.route("/search").get(getCoursesByType)
router.route("/:id").get(getCoursesByID).put(updateCourse).delete(deleteCourseByID)
router.route('/:courseId/students').get(getStudentsOfCourse)





export default router
