const express = require('express')
const app = express()

const cors = require('cors')

// cookie-parser
const cookieParser = require('cookie-parser')

// .env
require('dotenv').config()

// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// cookie-parser
app.use(cookieParser())
// cors
app.use(cors())

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

// 회원가입, 로그인, 로그아웃
app.use('/users', require('./routes/users'))
// 게시판
app.use('/posts', require('./routes/posts'))
