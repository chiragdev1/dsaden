import {Router} from 'express'
import { check, login, logout, register } from '../controllers/auth.controllers.js'
import { authMiddleware } from '../middlewares/auth.middlewares.js'

const authRoutes = Router()

// Write register , login , logout , check

authRoutes.post('/register', register)

authRoutes.post('/login', login)

authRoutes.post('/logout', authMiddleware, logout)

authRoutes.get('/check', authMiddleware, check) 


export default authRoutes