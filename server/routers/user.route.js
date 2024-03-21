import { Router } from "express";
import { changeCurrentPassword, forgetPassword, getCurrentUser, logOutUser, loginUser, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.post("/user/register",
upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]
), registerUser);

userRouter.get("/user",verifyJwt,getCurrentUser);
userRouter.post("/user/login", loginUser);
userRouter.get("/user/logout",verifyJwt, logOutUser);
userRouter.put("/user/password",verifyJwt, changeCurrentPassword);
userRouter.post("/user/forgetpassword",forgetPassword);
userRouter.put("/user/update",verifyJwt,updateAccountDetails);

export default userRouter;
