import express from 'express'

import { createProblem, deleteProblemById, getAllProblems, getProblemById, getSolvedProblemsByUser, updateProblemById } from '../controllers/problem.controllers.js'
import { authenticateUser, checkAdmin } from '../middlewares/auth.middleware.js'

const problemRoutes = express.Router()

problemRoutes.post('/create-problem', authenticateUser, checkAdmin, createProblem)

problemRoutes.get('/get-all-problems',authenticateUser, getAllProblems)

problemRoutes.get('/get-problem/:id',authenticateUser, getProblemById)

problemRoutes.put('/update-problem/:id',authenticateUser, checkAdmin, updateProblemById)

problemRoutes.delete('/delete-problem/:id',authenticateUser, checkAdmin, deleteProblemById)

problemRoutes.get('/get-solved-problems',authenticateUser, getSolvedProblemsByUser)

export default problemRoutes