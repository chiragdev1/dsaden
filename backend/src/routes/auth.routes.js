import {Router} from 'express'
import { check, login, logout, register } from '../controllers/auth.controllers.js'
import { authenticateUser } from '../middlewares/auth.middlewares.js'

const authRoutes = Router()

// Write register , login , logout , check

authRoutes.post('/register', register)

authRoutes.post('/login', login)

authRoutes.post('/logout', authenticateUser, logout)

authRoutes.get('/check', authenticateUser, check) 


export default authRoutes