const router = require('express').Router()
const Post = require('../models/Post')
const moment = require('moment')

// 게시글 생성
router.post('/', (req, res) => {
  const post = new Post()
  post.title = req.body.title
  post.content = req.body.content
  // moment 모듈을 사용하여 날짜 포매팅
  post.createdAt = moment().format('YYYY-MM-DD hh:mm:ss')

  post.save((err, result) => {
    if (err) res.json(err)
    res.json(result)
  })
})

// 전체 게시글 출력
router.get('/', (req, res) => {
  Post.find({})
    .sort('-createdAt') // 최근 작성된 포스트 순으로 정렬
    .exec((err, posts) => {
      if (err) return res.json(err)
      res.json(posts)
    })
})

// 특정 게시글 출력
router.get('/:post_id', (req, res) => {
  Post.findOne({ _id: req.params.post_id }, (err, result) => {
    if (err) res.json(err)
    res.json(result)
  })
})

// 게시글 수정
router.put('/:post_id', (req, res) => {
  req.body.updateAt = moment().format('YYYY-MM-DD hh:mm:ss')
  Post.findOneAndUpdate(
    { _id: req.params.post_id },
    req.body,
    (err, result) => {
      if (err) res.json(result)
      res.json({ message: 'post updated' })
    }
  )
})

// 게시글 삭제
router.delete('/:post_id', (req, res) => {
  Post.deleteOne({ _id: req.params.post_id }, (err) => {
    if (err) return res.json(err)
    res.status(204).end()
  })
})

module.exports = router
