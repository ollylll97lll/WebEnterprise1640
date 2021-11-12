const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    totalStaff: {
        type: Number
    }
})

module.exports = mongoose.model('department', DepartmentSchema)
