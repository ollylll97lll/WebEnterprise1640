const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    postId:{ 
        type: Schema.Types.ObjectId,
        ref:'post'
    },
    comments: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref:'user'
        },
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
        }
    }]
})

module.exports = mongoose.model('comment', CommentSchema)