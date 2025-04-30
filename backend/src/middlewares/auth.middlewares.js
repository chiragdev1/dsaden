import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'


export const authMiddleware = async (req, res, next) => {
   try {
      // Get the token from cookies
      const token = req.cookies.jwt

      // validate token
      if(!token) {
         return res.status(401).json({
            message: 'Unauthorized - No token provided'
         })
      }

      // Extract user id from token
      let decoded

      try {
         decoded = jwt.verify(token, process.env.JWT_SECRET)
      } catch (error) {
         console.log('Invalid token', error)
         return res.status(401).json({
            message: "Unauthorized - Invalid token",
         });
      }

      const user = await db.user.findUnique({
         where: {
            id: decoded.id
         }, 
         select: {
            id: true,
            name: true,
            email: true, 
            avatar: true,
            role: true
         }
      })

      if(!user){
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      req.user = user
      next()

   } catch (error) {
      console.log('Error authenticating user', error)
      res.status(500).json({
         success: false,
         message: 'Error authenticating user'
      })
   }
}