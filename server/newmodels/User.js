const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    department: {
        type: String,
    },

    departmentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'departments'
    },

    role: {
        type: String,
    },

    createdAt: {
        type: Date,
    },
    // bài user post
    posts: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'posts',
        },
    }],
    // bài user like/dislike
    // set unique vì 1 bài like || dislike 1 lần
    // khi !like && !dislike 
    // (true thì like = 1 || dislike = -1, false thì like = 0 || dislike = 0)
    // || like === undefined || dislike === undefined thì xóa document này.
    likedposts: [{
        postId: {
            type: Schema.Types.ObjectId,
            unique: true,
            ref: 'posts'
        },
        like: {
            type: Boolean,
            required: true,
        },
        dislike: {
            type: Boolean,
            required: true
        }
    }]
})

module.exports = mongoose.model('user', UserSchema)