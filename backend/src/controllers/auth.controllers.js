import bcrypt from "bcryptjs"
import {db} from '../libs/db.js'
import { UserRole } from "../generated/prisma/index.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

export const register = async (req, res) => {
   const {email, password, name} = req.body

   try {
      // Check for existing user in db
      const existingUser = await db.user.findUnique({
         where: {
            email
         }
      })

      // If user exists, return error
      if(existingUser) {
         return res.status(400).json({
            error: 'User already exists'
         })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user in db
      const newUser = await db.User.create({
         data: {
            email,
            password: hashedPassword,
            name,
            role:UserRole.USER

         }
      })


      const token = jwt.sign({ id: newUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'})

      // Set token in cookie
      res.cookie("jwt", token, {
         httpOnly: true,
         sameSite: 'strict',
         secure: process.env.NODE_ENV !== 'development',
         maxAge: 1000 * 60 * 60 * 24 // 1 day
      })

      res.status(201).json({
         success: true,
         message: 'User created successfully',
         user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar,
         }
      })


   } catch (error) {
      console.error("Error creating user:", error)
      res.status(500).json({
         error: 'Internal server error'
      })
   }
}  

export const login = async (req, res) => {
   const {email, password} = req.body

   try {
      const user = await db.user.findUnique({
         where: {
            email
         },
      });

      if (!user) {
         return res.status(401).json({
            error: "User not found",
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({
            error: "Invalid Credentials",
         });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
         expiresIn: "1d",
      });

      res.cookie("jwt", token, {
         sameSite: "strict",
         httpOnly: true,
         secure: process.env.JWT_SECRET !== "development",
         maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      res.status(200).json({
         success: true,
         message: "User Logged in successfully",
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
         },
      });
   } catch (error) {
      console.log('Login failed', error)
      res.send(401).json({
         error: `Couldn't Login`
      })
   }
}

export const logout = async (req, res) => {
   
   try {
      res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development'
      })

      res.status(204).json({
         success: true,
         message: "User logged out successfully",
         
      })
   } catch (error) {
      console.log('Logout Unsuccessful',error)
      res.status(500).json({
         success:false,
         error: 'Logout unsuccessful'
      })
   }
}

export const check = async (req, res) => {}