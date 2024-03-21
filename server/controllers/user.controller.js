import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudianry } from "../utils/cloudinary.js"
import Jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";


const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body;
    //validation of the required values
    if (
        [fullName, email, username, password].some((item) => item?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    //validation of the existing user
    const isUserExist = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserExist) {
        throw new ApiError(409, 'User Already Exist')
    }

    //using multer includes files to access
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    // console.log(avatarLocalPath)
    // console.log(coverLocalPath)

    const avatar = await uploadOnCloudianry(avatarLocalPath);

    // console.log(avatar)
    // console.log(cover)


    const userRegister = await User.create({
        fullName: fullName,
        avatar: avatar?.url || "",
        email: email,
        username: username,
        password: password
    });

    if (!userRegister) {
        res.status(500).json({
            message: "Something Went wrong Try again!"
        });
    }

    res.status(200).json({
        message: "Registered Successfully"
    });

});

const options = {
    httpOnly: true,
    secure: true
}


const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;
    //validation of the required values
    if (username && email) throw new ApiError(400, "email or username is required");


    const ValidUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!ValidUser) throw new ApiError(404, "User Does not exist");
    if (!password) throw new ApiError(400, "Password is required");

    if (!await ValidUser.isPasswordCorrect(password)) {
        res.status(401).json({
            message: "Invalid username, email, or password"
        });
    }

    const accessToken = await ValidUser.generateAccessToken();
    const refreshToken = await ValidUser.generateRefreshToken();
    if (!refreshToken)
        throw new ApiError(500, "something went wrong");

    const rtoken = await User.findByIdAndUpdate(ValidUser._id, { refreshToken: refreshToken });

    if (!rtoken)
        throw new ApiError(500, "something went wrong");

    return res.status(200).cookie("authId", accessToken, options)
        .cookie("referId", refreshToken, options).json({
            message: "Logged in Success"
        });

});

//  LOG OUT
const logOutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: ''
        }
    });

    return res.status(200).clearCookie("authId", options)
        .clearCookie("referId", options)
        .json({
            message: "Logged Out Success"
        });
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const refereshToken = req.cookies.referId || req.body.referId
    console.log("from user controller ", refereshToken)

    if (!refereshToken) {
        throw new ApiError(401, "Session Expired");
    }
    const decodedToken = Jwt.verify(refereshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    if (user.refreshToken !== refereshToken) {
        throw new ApiError(401, "Refresh Token is Expired");
    }

    const newAccessToken = await user.generateAccessToken();
    // Update user document with refresh token
    const newRefreshToken = await user.generateRefreshToken();
    const rtoken = await User.findByIdAndUpdate(user?._id, { refreshToken: newRefreshToken });
    if (!rtoken)
        throw new ApiError(500, "something went wrong");

    return res.status(200).cookie("authId", newAccessToken, options)
        .cookie("referId", rtoken.newRefreshToken, options).json({
            message: "Access Token Refreshed"
        });
});

// CHANGE PASSWORD  
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) throw new ApiError(400, "Password required");

    const userId = req.user?._id
    const UserInfo = await User.findById(userId);

    if (!UserInfo) throw new ApiError(500, "Could not fetch user");

    const isValidPassword = UserInfo.isPasswordCorrect(oldPassword);

    if (!isValidPassword) throw new ApiError(401, "Invalid Password");

    UserInfo.password = newPassword;
    await UserInfo.save({ validateBeforeSave: false }) //  we are not checking other fields that are validate or not like fullname username etc

    res.status(200).json({
        message: "Password Changed Successfully"
    });

});

//  GET USER DETAILS
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user)
        throw new ApiError(500, "Internal server Error");

    return res.status(200).json(200, req.user, "Current user Fetched Success")
});

// UPDATE USER DETAILS
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (fullName && email) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName: fullName,
            email: email
        }
    }, { new: true }).select("-password")

    if (!user) {
        throw new ApiError(500, "Something went wrong while updating")
    }

    return res.status(200).json({
        data: user,
        message: "Accound Details Updated Successfully"
    });

});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is missing")
    }
    const avatar = await uploadOnCloudianry(avatarLocalPath)
    if (!(avatar.url)) {
        throw new ApiError(500, "Something went wrong")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar?.url,
        }
    }, { new: true }).select("-password")

    if (!user) {
        throw new ApiError(500, "Something went wrong while updating")
    }

    return res.status(200).json({
        data: user,
        message: "Image Updated Successfully"
    });

});

// FORGET PASSWORD AND RESET PASSWORD
const forgetPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body?.email });
    if (!user)
        throw new ApiError(404, "User Not Found");

    const resetToken = await user.generateRefreshToken();
    console.log(resetToken)
    if (!resetToken)
        throw new ApiError(500, "Something went wrong");

    user.refreshToken = resetToken;
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is  : \n\n ${resetPasswordUrl} \n If you have not requested this then please ignore it`;

    console.log(":yha tk ok")
    try {

        await sendEmail({
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: "E-Basket Password reset",
            message: message
        })

        res.status(200).json(new ApiResponse(200, "Email has been sent"))

    } catch (error) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ApiError(500, "Something went wrong"));
    }

})



export {
    registerUser,
    loginUser, logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    forgetPassword
}