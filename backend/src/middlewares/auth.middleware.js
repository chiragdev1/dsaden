import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async( req, res, next) => {
   console.log("inside authenticateUser")
   // Get the jwt token from cookie
   const jwtToken = req.cookies["jwt"]
   let decoded

   try {

      decoded =  jwt.verify(jwtToken, process.env.JWT_SECRET);

      // verify the user in database using id
      const user = await db.user.findUnique({
         where: {
            id: decoded.id
         }, select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true
         }
      })

      // TODO Add better response messages
      if(!user) {
         return res.status(404).json({
            success: false,
            message: "User doesn't exist"
         })
      }
      // send the user in req.user
      // console.log("user", user)
      req.user = user
      next()
      
   } catch (error) {
      console.log("Invalid user")
      // TODO write better error messages
      return res.status(401).json({
         success: false,
         message: "User not authenticated"
      })
   }
   // handle server side error in catch
}

export const checkAdmin = async (req, res, next) => {
   console.log("inside checkAdmin")

   // Get the userId from jwt token
   const token = req.cookies['jwt']
   // console.log('token', token)

   let decoded
   try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // get the user role from database
      const user = await db.user.findUnique({
         where: {
            id: decoded.id,
         }, select: {
            role: true
         }
      })

      // validate user from db
      if(!user) {
         console.log("user", user)
         return res.status(404).json({
            success: false,
            message: "User not found"
         })
      }
      // console.log("user", user)
      // check if user is admin
      if(user.role !== 'ADMIN') {
         console.log("User", user)
         console.log("user.role = ", user.role)
         return res.status(401).json({
            success: false,
            message: `User not authorized, checkAdmin, ${user.role}`
         })
      }

      // handle server side error
   } catch (error) {
      console.log("Error checking user role", error)
      return res.status(400).json({
         success: false,
         message: "Failed to check user role"
      })
   }
   next()
}