import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"




const generateAccessAndRefreshTokens = async (userId) =>
{
    try {
        const user= await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken= refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw  new ApiError(500,"Something went wrong while generating access and refresh token!")
        
    }
}




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



const loginUser = asyncHandler(async(req,res)=>{
      //req.body-> data
      //username or email
      //find the user 
      //check the pass
      //access and refresh token
     // send cookie

     const {email, username, password} = req.body
     if (!(username || email)) {
        throw new ApiError(400,"username or password is required")
     }

     const user =await User.findOne ({
        $or: [{username}, {email}]
     })
     if (!user)
     {
        throw new ApiError(404,"User doesnot exist" )
     }
     
    const isPasswordValid= await user.isPasswordCorrect(password)
     
    if (!isPasswordValid)
        {
           throw new ApiError(401,"Invlaid user Credentials!" )
        }

        const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
       
        const options={
            httpOnly: true,
            secure: true
        }

        return res.status(200).
        cookie("accessToken", accessToken,options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
            )
         )

})




const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
                req.user._id,{
                $unset: {
                    refreshToken: 1 //this removes the field from document
                    },
                
                                  },
 
            {
                new: true
            }
                                   )

            const options ={
                httpOnly: true,
                secure: true
            }
            return res.
            status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(new ApiResponse(200, {}, "User logged Out"))
})



        
const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken= 
    req.cookies.refreshToken   || req.body.refreshToken
    
    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    } 
 try {
       const decodedToken= jwt.verify(
           incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
       )
   
       const User = await User.findById(decodedToken?._id)
       if (!user) {
           throw new ApiError(401, " Invalid refresh Token")
       }
       if(incomingRefreshToken != user?.refreshToken)
       {
           throw new ApiError(401, "refresh token is used or expired!")
   
       }
       const options = {
           httpOnly: true,
           secure: true
       }
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
   
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
           new ApiResponse(200,
               {accessToken, newRefreshToken},
                   "access token refreshed!"
               
           )
       )
   
 } catch (error) {
    new ApiError(401, error?.message || "Invalid refresh token")
    
 }
})


export {registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken
}