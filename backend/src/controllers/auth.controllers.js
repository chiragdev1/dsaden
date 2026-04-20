import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {db} from '../libs/db.js'
import {UserRole} from '../generated/prisma/index.js'

export const register = async (req, res) => {
   //  Get data from req.body
   const {email, name, password} = req.body

   // Simple validation
   // todo Add better validation
   if(!email || !name || !password){
      return res.status(401).json({
         success: true,
         message: "Invalid Credentials"
      })
   }

   //  tryCatch
   try {
      
      // check for existing user with the same email
      const existingUser = await db.user.findUnique({
         where: {
            email
         }
      })

      if(existingUser) {
         
         return res.status(409).json({
            success: false,
            message: "User already exists",
         })
      }

      // hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10)

      // create new user
      const newUser = await db.user.create({
         data: {
            email,
            name, 
            password: hashedPassword,
            role: UserRole.USER
         }
      })

      // Check if new user was added in database
      if(!newUser) {
         return res.status(500).json({
            success: false,
            message: "User could not be created due to server error"
         })
      }

      // assign a jwt token

      const token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET, {expiresIn: "7d",});

      if (!token) {
         return res.status(500).json({
            success: false,
            message: "User not registered, jwt token not assigned",
         });
      }
      

      // store the token in cookies
      res.cookie("jwt", token, {
         httpOnly: true,
         sameSite: 'strict',
         secure: process.env.NODE_ENV !== "development",
         maxAge: 1000 * 60 * 60 * 24 
      })

      // send success response (201)
      res.status(201).json({
         success: true,
         message: "User registered",
         user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
         }
      })

   } catch (error) {
      
      // Handle error in catch (500)
      console.log(`User Registration failed. error: ${error}`);
      res.status(400).json({
         success: false,
         message: `User Registration failed.`,
      });
   }
}

export const login = async (req, res) => {
   // get email and password from req.body
   const {email, password} = req.body

   // validate input data
   // TODO Add better validation
   if(!email || !password){
      return res.status(401).json({
         success: false,
         message: "invalid credentials"
      })
   }

   // tryCatch
   try {
      // check if user exist 401
      const user = await db.user.findUnique({
         where: {
            email
         },
      });

      if (!user) {
         return res.status(401).json({
            success: false,
            message: "User doesn't exist.",
         });
      }

      // match the passwords
      const isMatch = await bcrypt.compare(password, user.password)

      // assign jwt token
      const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'})

      // store token in cookie
      res.cookie("jwt", token, {
         httpOnly: true,
         sameSite: "strict",
         secure: process.env.NODE_ENV !== "development",
         maxAge: 1000 * 60 * 60 * 24,
      });

      // send Success response 200
      res.status(200).json({
         success: true,
         message: "Logged In",
         user
      })
   } catch (error) {

      // Handle error in catch 500
      console.log("Error logging in", error)
      res.status(500).json({
         success: false,
         message: "Login failed."
      })
   }
   
}

export const logout = async (req, res) => {

   // try catch
   try {
      
      // Clear jwt token from the cookies
      res.clearCookie("jwt", {
         httpOnly: true,
         sameSite: "strict",
         secure: process.env.NODE_ENV !== "development"
      })

      // send Success response 204
      res.status(204).json({
         success: true,
         message: "User Logged Out"
      })
   } catch (error) {

      // Handle server side errors in catch 500
      console.log("Logout failed ", error)

      res.status(500).json({
         success: false,
         message: "Logout failed"
      })
      
   }
}

export const check = async (req, res) => {
   // return the user from req.body
   const user = req.user
   if(!user){
      return res.status(404).json({
         success: false,
         message: "User not logged in"
      })
   }
   // todo send success, message, user in response
   res.status(200).json({
      success: true,
      message: "User checked",
      user: user
   })
}