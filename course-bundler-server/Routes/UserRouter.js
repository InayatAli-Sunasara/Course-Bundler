import express from "express";
import {
  addToplayList,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlayList,
  resetPassword,
  updateProfile,
  updateProfilePicture,
  updateUserRole,
} from "../Controllers/UserController.js";
import { authorizeAdmin, isAuthenticated } from "../MiddleWare/Auth.js";
import singleUpload from "../MiddleWare/Multer.js";
const router = express.Router();
// To register new user
router.route("/register").post(singleUpload, register);

// Login
router.route("/login").post(login);

// Logout
router.route("/logout").get(logout);

// Get My Profile
router.route("/me").get(isAuthenticated, getMyProfile);

// Delete My Profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

// Change Password
router.route("/changepassword").put(isAuthenticated, changePassword);

// update Profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

// Update Profile Picture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

// Forget Password
router.route("/forgetpassword").post(forgetPassword);

// Reset Password
router.route("/resetpassword/:token").put(resetPassword);

// Add To playlist
router.route("/addtoplaylist").post(isAuthenticated, addToplayList);

// Remove From Playlist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlayList);

// Admin Routes
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

// Update user Role

router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);
export default router;
