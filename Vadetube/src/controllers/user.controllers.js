import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const existedUser = User.findOne( {
    $or: [{ username }, { email }]
  } )

  if(existedUser) {
    throw new ApiError(409, "User already exits")
  }

  const avatarLocalPath =  req.files?.avatar[0]?.path
  console.log("avatarLocalPath :: ",avatarLocalPath)
  
  const coverImageLocalPath = req.files?.coverImage[0]?.path
  console.log("coverImageLocalPath :: ",coverImageLocalPath)

  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar is required")
  }

  const user = await User.create( {
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    email,
    username: username.toLowerCase()
  } )

  const cretedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  
  if(!cretedUser) {
    throw new  ApiError(500, "Somthing went wrong while registrting a user")
  }

  return res.status(201).json(
    await new ApiResponse(201, cretedUser, "user registerd Successfully")
  )

});

export { registerUser };
