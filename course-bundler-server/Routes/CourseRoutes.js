import express from "express";
import {
  addLectures,
  createCourses,
  deleteCourses,
  deleteLectures,
  getAllCourses,
  getCourseLectures,
} from "../Controllers/CourseControllers.js";
import singleUpload from "../MiddleWare/Multer.js";
import { authorizeAdmin, isAuthenticated } from "../MiddleWare/Auth.js";

const router = express.Router();
// Get all courses without lectures
router.route("/courses").get(getAllCourses);

// create new course only admin
router
  .route("/createcourses")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourses);

// Add lecture Delete Course Get Course Detail
router
  .route("/course/:id")
  .get(isAuthenticated, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLectures)
  .delete(isAuthenticated, authorizeAdmin, deleteCourses);

// Delete Lectures
router
  .route("/lecture/")
  .delete(isAuthenticated, authorizeAdmin, deleteLectures);

export default router;
