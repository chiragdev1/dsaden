import express from 'express'


const problemRoutes = express.Router()

problemRoutes.post('/create-problem', createProblem)



export default problemRoutes