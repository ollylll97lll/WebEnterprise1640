const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SessionSchema = new Schema({
    session: {
        type: String,
    },

    startedDate: {
        type: String,
    },

    endedDate: {
        type: String,
    },

    topic: {
        type: String,
    }
})

module.exports = mongoose.model('session', SessionSchema)