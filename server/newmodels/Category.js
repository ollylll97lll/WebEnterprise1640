const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startdate:{
        type: Date,
        required: true,
    },
    enddate: {
        type: Date,
        required: true
    },
    // closuredate = enddate + 7 days later
    closuredate: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('category', CategorySchema)