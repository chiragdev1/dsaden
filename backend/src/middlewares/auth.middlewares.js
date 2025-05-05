import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'


export const authenticateUser = async (req, res, next) => {
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

export const checkAdmin = (req, res, next) => {
   try {
      const userId = req.user.id
      const userRole = db.user.findUnique({
         where: {
            id: userId
         },
         select: {
            role:true
         }
      })

      if(!user || userRole !== 'ADMIN') {
         return res.status(403).json({
            success: false,
            message: 'Access denied - Admins only'
         })
      }
      next()

   } catch (error) {
      console.error('Error checking admin', error)
      res.status(500).json({
         success: false,
         message: 'Error checking admin role'
      }) 
      
   }
}