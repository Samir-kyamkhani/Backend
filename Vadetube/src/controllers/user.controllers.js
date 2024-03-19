import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generatAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generatAccessToken();
    const refreshToken = user.generatRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generat refresh and access tokens",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend ✔
  // validation of details ✔
  // chkeck if details is not empty ✔
  // check if user already exixts through username and email ✔
  // chek for images ✔
  // chek for avatar ✔
  // if upload on coudinary, chek avtar ✔
  // create user object - create entry in db ✔
  // remove password and refresh token field from response ✔
  // check for user created ✔
  //? return res : null ✔

  const { fullName, email, username, password } = req.body;
  console.log("Username: ", username);

  if (
    [fullName, email, username, password].some((feild) => feild?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exits");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    email,
    username: username.toLowerCase(),
  });

  const cretedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!cretedUser) {
    throw new ApiError(500, "Somthing went wrong while registrting a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, cretedUser, "user registerd Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // user details > req.body => data
  // login through username or email
  // validation empty field
  // check if user already exits or not || find user
  // password check correct or not
  // access and refresh token
  // send cookies

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exits!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user creddentials");
  }

  const { accessToken, refreshToken } = await generatAccessAndRefreshTokens(
    user._id,
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "User logged in succesfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully"));
});

const refreshAccesToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generatAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(401, "Password is not confirm");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(200, req.user, "Current User Fathced")
  );
});

const updateAccoundDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  if (!fullName || !email || !username) {
    throw new ApiError(400, "Please provide all fields");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
        username: username,
      },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details update successfully "));
});

const updateUserAvatar = asyncHandler( async (req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Error While uploading Avatar on cloudinary")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Avatar is successfully update"))
})

const updateUserCoverImage = asyncHandler( async (req, res) => {
  
  const coverImageLocalPath = req.file?.path
  
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing while localPath")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage) {
    throw new ApiError(400, "Cover image file is missing while uploading on cloudinary")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Cover image is Successfully update"))

})

const getUserCurrentProfile = asyncHandler( async (req, res) => {
  
  const {username} = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing!")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channlSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: {$in: [req.user?._id, "subscribers.subscribe"]},
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        email: 1,
        username: 1,
        subscribedToCount: 1,
        channlSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      }
    }
  ])
  console.log("Channel:: ",channel);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exits")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, channel[0], "User channel fatched successfully"))


})

const getWatchHistory = asyncHandler( async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: mongoose.Schema.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
  .status(200)
  .json(new ApiResponse(200, user[0].watchHistory, "Watch history is successfully"))
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccesToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccoundDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserCurrentProfile,
  getWatchHistory
};
