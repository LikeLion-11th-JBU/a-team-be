const express = require('express')
const app = express()

const router = express.Router()

// cookie-parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const { auth } = require('../middleware/auth')
// 유저 모델 스키마
const { User } = require('../models/User')

// 회원가입
router.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에게 받으면 DB에 저장
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})

// 로그인
router.post('/login', (req, res) => {
  // 요청된 이메일을 DB에서 찾기
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: '해당 이메일은 없습니다.',
        })
      }
      // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: '비밀번호가 틀렸습니다.',
          })
        }
        // 비밀번호까지 맞다면 토큰 생성
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err)
          // 쿠키에 토큰을 저장한다.
          res
            .cookie('x_auth', user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })
      })
    }
  )
})

// auth 미들웨어를 통과해야 다음으로 넘어감
router.get('/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  })
})

// 로그아웃
router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({ success: true })
  })
})

module.exports = router
