const mongoose = require('mongoose')
const moment = require('moment')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: moment().format('YYYY-MM-DD hh:mm:ss'),
  },
  updateAt: {
    type: Date,
  },
})

const Post = mongoose.model('post', postSchema)

module.exports = Post
