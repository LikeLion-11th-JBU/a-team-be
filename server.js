const express = require('express')
const app = express()

// cookie-parser
const cookieParser = require('cookie-parser')

// .env
require('dotenv').config()

// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// cookie-parser
app.use(cookieParser())

// MongoDB 연결
const mongoose = require('mongoose')
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...')
    app.listen(process.env.PORT, () => {
      console.log(`Listening on ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })

// 회원가입
app.use('/users', require('./routes/users'))
