// 유저 모델 스키마
const mongoose = require('mongoose')
// bcrypt
const bcrypt = require('bcrypt')
const saltRounds = 10

// jwt
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    // 관리자와 일반유저 구분
    type: Number,
    default: 0, // 0은 일반유저, 1은 관리자
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

// save하기 전 비밀번호 암호화
userSchema.pre('save', function (next) {
  const user = this
  // 비밀번호를 바꿀 때만 암호화
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

// 비밀번호 비교 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  const user = this
  // plainPassword를 암호화해서 db에 있는 비밀번호와 비교
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

// 토큰 생성 메소드
userSchema.methods.generateToken = function (cb) {
  const user = this
  // jsonwebtoken을 이용해서 token을 생성하기
  const token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    cb(null, user)
  })
}

// 토큰 복호화 메소드
userSchema.statics.findByToken = function (token, cb) {
  const user = this
  // 토큰을 decode 한다.
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸준다

module.exports = { User } // export
