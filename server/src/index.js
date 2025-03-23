import 'dotenv/config'
import express from 'express'
import connectDB from './db/index.js'
import app from './app.js'
import { DB_NAME } from './constants.js'

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.error('Server error:', error)
    })

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
  })
