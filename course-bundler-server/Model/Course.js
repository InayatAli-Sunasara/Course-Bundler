import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Title"],
    minLength: [4, "Title must be atleast 4 characters"],
    maxLength: [80, "Title cant exceed 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"],
    minLength: [20, "Description must be atleast 20 characters"],
  },
  lectures: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      video: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },
  ],
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  views: {
    type: Number,
    default: 0,
  },
  numberOfVideos: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: [true, "Enter Course Creater Name"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
export const Course = mongoose.model("Course", schema);
