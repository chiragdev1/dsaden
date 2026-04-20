import express from 'express'


import { check, login, logout, register } from '../controllers/auth.controllers.js'
import { authenticateUser } from '../middlewares/auth.middleware.js'


const authRoutes = express.Router()

authRoutes.post("/register", register)
authRoutes.post("/login", login)
authRoutes.get("/logout",authenticateUser, logout)
authRoutes.post("/check",authenticateUser, check)

export default authRoutes