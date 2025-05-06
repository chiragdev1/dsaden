import express from 'express'
import { authenticateUser, checkAdmin } from '../middlewares/auth.middlewares'
import {
   createProblem,
   getAllProblems,
   getProblemById,
   updateProblem,
   deleteProblem
} from "../controllers/problem.controllers";


const problemRoutes = express.Router()

problemRoutes.post('/create-problem', authenticateUser, checkAdmin, createProblem)

problemRoutes.get('/get-all-porblems', authenticateUser, getAllProblems)

problemRoutes.get('/get-problem/:id', authenticateUser, getProblemById)

problemRoutes.put('/update-problem/:id', authenticateUser, checkAdmin, updateProblem)

problemRoutes.delete('/delete-problem/:id', authenticateUser, checkAdmin, deleteProblem)

problemRoutes.get('/get-solved-problems', authenticateUser, getAllProblemsSolvedByUser)

export default problemRoutes