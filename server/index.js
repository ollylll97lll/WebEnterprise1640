require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const UserAuth = require('./routes/auth')
const newUserAuth = require('./newroutes/auth')
const Article = require('./routes/article')
const Post = require('./newroutes/post')
const Seasons = require('./routes/seasons')
const Category = require('./newroutes/category')
// const User = require('./routes/user')
const User = require('./newroutes/user')

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@webenterprise1640.1vlbz.mongodb.net/webenterprise1640?retryWrites=true&w=majority` , {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log('MongoDB connected')
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

connectDB()

const app = express();

app.use(express.json())

app.use(cors())

// app.use('/api/auth', UserAuth)
app.use('/api/auth', newUserAuth)

app.use('/api/post', Post)
app.use('/api/category', Category)

app.use('/api/user', User)

// Old routes
app.use('/api/article', Article)
app.use('/api/season', Seasons)
// 
app.get('/', (req, res) => res.send("Hello"))

const PORT = 5001;

app.listen(PORT, () => console.log("Server starts on PORT " + PORT))