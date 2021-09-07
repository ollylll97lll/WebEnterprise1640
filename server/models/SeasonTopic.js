const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeasonTopicSchema = new Schema({
    season: {
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

module.exports = mongoose.model('seasonTopic', SeasonTopicSchema)