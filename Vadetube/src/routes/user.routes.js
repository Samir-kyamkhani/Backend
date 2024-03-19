import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserCurrentProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccesToken,
  registerUser,
  updateAccoundDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);

//Secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccesToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccoundDetails);
router
  .route("/edit-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/edit-cover-image")
  .patch(verifyJwt, upload.single("/coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJwt, getUserCurrentProfile);
router.route("/history").get(verifyJwt, getWatchHistory);

export default router;
