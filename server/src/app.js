import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApiError } from './utils/ApiError.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({
  limit: '16kb',
}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

export default app
