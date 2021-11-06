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
        email:{
            type: String,
            ref:'user',
            required: true
        },
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
        },
        isAnonymous: {
            type: Boolean
        }
    }]
})

module.exports = mongoose.model('comment', CommentSchema)