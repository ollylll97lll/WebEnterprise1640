const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    title: {
        type: String,
    },

    content: {
        type: String,
    },

    department: {
        type: String,
    },
    docfolder: {
        type: String
    },
    likes: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
    },
})

module.exports = mongoose.model('post', PostSchema)