import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'


dotenv.config()


const app = express()
const port = process.env.PORT || 4000


app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
   res.send('<h1>Hello guys! Welcome to DSADEN🔥</h1>')
})

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/problems', problemRoutes)

app.listen(3000, () => {
   console.log(`Server is running on port ${port}`)
})