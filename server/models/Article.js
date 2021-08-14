const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: {
        type: String,
    },

    description: {
      type: String,  
    },

    type: {
        type: String,
    },

    topic: {
        type: String,
    },

    falcuty: {
        type: String,
    },

    duration: {
        type: String,
    },

    session: {
        type: String,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    creator: {
        type: String,
    },

    createdAt: {
        type: Date,
    },

    comment: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },

        email: {
            type: String,
            ref: 'comments'
        },

        commentText: {
            type: String,
            ref: 'comments'
        }
    }]
})

module.exports = mongoose.model('articles', ArticleSchema)