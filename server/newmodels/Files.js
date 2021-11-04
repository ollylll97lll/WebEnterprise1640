const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'post'
    },
    files: [
        {
            filename: {
                type: String,
                required: true
            },
            file: {
                data: Buffer,
                contentType: String,
            }
        }
    ]
})

module.exports = mongoose.model('files', FileSchema)
