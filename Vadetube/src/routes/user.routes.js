import { Router } from "express";
import { loginUser, logoutUser, refreshAccesToken, registerUser } from "../controllers/user.controllers.js";
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

router.route("/login").post(loginUser)

//Secured routes
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccesToken)


export default router;
