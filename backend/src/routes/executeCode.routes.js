import express from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js'
import { executeCode } from '../controllers/executeCode.controllers.js'

const executeCodeRoutes = express.Router()


executeCodeRoutes.post("/", authenticateUser, executeCode)

export default executeCodeRoutes