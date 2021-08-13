const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    email: {
        type: String,
    },

    commentText: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('comments', CommentSchema)