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
            faculty: req.faculty,
            topic: currentSession[0].topic,
            duration: currentSession[0].startedDate + ' ' + '-' + ' ' + currentSession[0].endedDate,
            session: currentSession[0].session,
            status: 'false',
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

//route api/article/status/:id
//Update Status of article using its ID
router.put('/status/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update article status with id=${id}. Maybe article was not found!`
            });
          } else res.send({ message: "Article status was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating article status with id=" + id
          });
        });
})

//route api/article/countAll
//Count All current article
router.get('/countAll', async (req, res) => {
  
    Article.find().countDocuments()
      .then(data => {
        res.json({ success: true, count: data })
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message:
            err.message || "Some error occurred while retrieving forms."
        });
      });
  })

//route api/article/countAll
//Count All current article
router.get('/countWith_faculty', async (req, res) => {
    const faculty = req.query.faculty;
    const condition = faculty ? { faculty: { $regex: new RegExp(faculty), $options: "i" } } : {};
  
    Article.find(condition).countDocuments()
      .then(data => {
        res.json({ success: true, count: data })
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message:
            err.message || "Some error occurred while retrieving forms."
        });
      });
  })

module.exports = router