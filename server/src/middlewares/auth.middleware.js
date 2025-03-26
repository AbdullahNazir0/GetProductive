import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"


export const verifyJwt = asyncHandler( async(req, _, next) => {
  try {
    const token = req.cookies.token
    if(!token) {
      throw new ApiError(401, "Invalid access token")
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password")
    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.userId = user._id;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
})
