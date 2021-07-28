const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    post: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'post',
        },

        title: {
            type: String,
            ref: 'post'
        },

        message: {
            type: String,
            ref: 'post'
        }
    }]
})

module.exports = mongoose.model('test', TestSchema)