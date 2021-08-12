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

    status: {
        type: Boolean,
        required: true,
    },

    faculty: {
        type: String,
    },

    role: {
        type: String,
    },
    article: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'articles',
        },

        title: {
            type: String,
            ref: 'articles',
        },
    
        description: {
          type: String,
          ref: 'articles',
        },
    
        type: {
            type: String,
            ref: 'articles',
        },
    
        topic: {
            type: String,
            ref: 'articles',
        },

        sessionName: {
            type: String,
            ref: 'articles',
        },
    }]
},
{
    timestamps: true
})

module.exports = mongoose.model('users', UserSchema)