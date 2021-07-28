const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    message: {
        type: String,
    }
})

module.exports = mongoose.model('post', PostSchema)