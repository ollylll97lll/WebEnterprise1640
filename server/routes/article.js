require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const Article = require('../models/Article')
const verifyUserToken = require('../middleware/userToken')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Session = require('../models/Session')

//route api/article/create
//Create Article for Student role
router.post('/create', verifyUserToken, async (req, res) => {
    const {title, description, type, file, topic, duration, session} = req.body

    // title ad description validation
    if(!title || !description)
    return res.status(500).json({success: false, message: 'Please enter a title or description'})

    //If good
    try {
        const user = await User.findOne({_id: req.userId})
        const currentSession = await Session.find().limit(1).sort({$natural: -1})
        const article = new Article({
            title: title, 
            description: description,
            type: type,
            topic: currentSession[0].topic,
            duration: currentSession[0].startedDate + ' ' + '-' + ' ' + currentSession[0].endedDate,
            session: currentSession[0].session,
            comment: [],
            userId: req.userId,
            creator: req.email,
            createdAt: moment().tz('Asia/Ho_Chi_Minh').format()
        })

        user.article.push(article)
        user.save()
        article.save()

        res.json({success: true, message: 'Article Successfully Created'})
        console.log(currentSession[0].startedDate + ' ' + '-' + ' ' + currentSession[0].endedDate)
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route api/article/add_comment
//Add comment in an Article
router.post('/add_comment', async (req, res) => {
    const {articleId, email, text} = req.body

    //if comment not input
    if(!text)
    res.status(500).json({ success: false, message: 'Please Input your comment'})

    //if all good
    try {
        const article = await Article.findOne({_id: articleId})
        const comment = new Comment({
            email,
            commentText: text,
        })

        article.comment.push(comment)
        article.save()

        res.json({ success: true, message: 'Comment Added successfully'})
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route api/article/getAll_Article
//Get all articles with queries of creator, userId, topic and session
router.get('/getAll_Article', async (req, res) => {
    const creator = req.query.creator;
    const creatorQuery = creator ? { creator: { $regex: new RegExp(creator), $options: "i" } } : {};

    const userId = req.query.userId;
    const idQuery = userId ? { userId: { $regex: new RegExp(userId), $options: "i" } } : {};

    const topic = req.query.topic;
    const topicQuery = topic ? { topic: { $regex: new RegExp(topic), $options: "i" } } : {};

    const session = req.query.session;
    const sessionQuery = session ? { session: { $regex: new RegExp(session), $options: "i" } } : {};

    Article.find(creator ? creatorQuery : userId ? idQuery : topic ? topicQuery : session ? sessionQuery : {})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving article."
        });
    });
})

module.exports = router