import { CatchAsyncError } from "../MiddleWare/CatchAsyncErrors.js";
import { Course } from "../Model/Course.js";
import getDataUri from "../Utils/DataURI.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import cloudiNary from "cloudinary";

export const getAllCourses = CatchAsyncError(async (req, res, next) => {
  const courses = await Course.find().select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});

export const createCourses = CatchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please Add All fields", 400));

  const file = req.file;
  // console.log(file);
  const fileUri = getDataUri(file);

  const myCloud = await cloudiNary.v2.uploader.upload(fileUri.content);
  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Course Created Successfully. You can Add lectures now",
  });
});

// Max video 100mb
export const getCourseLectures = CatchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

export const addLectures = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // const file = req.file;

  const course = await Course.findById(id);

  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  const file = req.file;
  const fileUri = getDataUri(file);

  const myCloud = await cloudiNary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  course.numberOfVideos = course.lectures.length;
  await course.save();
  res.status(200).json({
    success: true,
    message: "Lecture Added in course",
  });
});

export const deleteCourses = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  await cloudiNary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures; i++) {
    const singleLecture = course.lectures[i];
    await cloudiNary.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
    console.log(singleLecture.video.public_id);
  }

  course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course Deleted Successfully.",
  });
});

export const deleteLectures = CatchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  const course = await Course.findById(courseId);

  if (!course) return next(new ErrorHandler("Course Not Found", 404));

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureId.toString()) return item;
  });

  await cloudiNary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) return item;
  });

  course.numberOfVideos = course.lectures.length;
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture Deleted Successfully.",
  });
});
