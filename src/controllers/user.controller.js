import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async(req,res)=> {

    //get user details from frontend 
    //validation(either if it is valid data or not like empty not empty)
    //check if user is already exsits(username or email)
    //check for images, check for avatar
    //upload them to cloudinary, check if avatar is uploaded 
     //create user object - create entry in db
     //remove password and refresh token field from response 
     //check for user creation 
     //return response


     const {fullname, email, username, password }= req.body;
     console.log("password", password);
     if(
        [fullname, email, username, password].some((field)=> field?.trim()===""
     )){
            throw new ApiError(400, "all fields are required!")
     }


 // if(fullname===""){
        //     throw new ApiError(400, "Fullname required!")
        // }


     const existedUser = await User.findOne({
           $or: [{username}, { email }]
     })

     if (existedUser){
        throw new ApiError(409, "User already exist!")
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
    //  const coverImageLocalPath= req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath)
    {
        throw new ApiError(400, "avatar is required")
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)
    {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)
      
    console.log("Cloudinary upload result:", avatar);

    if(!avatar)
{
    throw new ApiError(400, "Avatar is required")

}


   const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url|| "",
    email,
    password,
    username: username.toLowerCase()
   })   
    
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if (!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")

   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully!")
   )


})

export {registerUser}