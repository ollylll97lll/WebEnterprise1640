require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const Article = require('../models/Article') //post
const Post = require('../newmodels/Post')
// const verifyUserToken = require('../middleware/userToken')
// const User = require('../models/User') //user
const User = require('../newmodels/User')
// const Comment = require('../models/Comment') //comment
const Comment = require('../newmodels/Comment')
// const SeasonTopic = require('../models/SeasonTopic') //category
const Category = require('../newmodels/Category')
const { isAuth } = require('../middleware/utils')
const date = new Date();

//route api/post/create
//Create Post for Student role
router.post('/create', isAuth, async (req, res) => {
  const { categoryId, title, content, department, files } = req.body

  // title ad description validation
  if (!title)
    return res.status(500).json({ success: false, message: 'Fill the tittle' })
  if (!content)
    return res.status(500).json({ success: false, message: 'Fill the content' })

  //If good
  try {
    const user = await User.findOne({ _id: req.user.userId })
    if (!user) {
      res.status(404).json({ success: false, message: 'User cannot be founded. Action Denied' });
    }
    const category = await Category.findOne({ _id: categoryId })
    if (!category) {
      res.status(404).json({ success: false, message: 'Category cannot be founded. Action Denied' });
    }
    // Check quá hạn nộp ?
    if (date.getUTCDate() > category.enddate) {
      res.status(500).json({ success: false, message: 'This category has closed. Action Denied' });
    }
    const post = new Post({
      categoryId: categoryId,
      userId: req.user.userId,
      title: title,
      content: content,
      department: department,
      files: files,
      likes: 0,
      createdAt: moment().tz('Asia/Ho_Chi_Minh').format()
    })
    await post.save()
    user.posts.push(post._id)
    user.save()

    res.json({ success: true, message: `Post Is Created. Title: ${post.title}` })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Something wrongs' })
  }
})

//route api/post/comment
//Add comment in a post
router.post('/comment', isAuth, async (req, res) => {
  const { postId, comment } = req.body

  //if comment not input
  if (!comment)
    res.status(500).json({ success: false, message: 'Comment is Empty. Cancel Request' })

  try {
    const post = await Post.findOne({ _id: postId })
    if (!post) {
      res.status(204).json({ success: false, message: 'There are no Post found. Try again' });
    }
    //if all good
    // check if there was any document for the post's comments
    const postcomments = await Comment.findOne({ postId: postId })
    // if there is none. Create new
    if (!postcomments) {
      const newpostcomments = new Comment({
        postId: postId,
        comments: [
          {
            userId: req.user.userId,
            comment: comment,
            createdAt: moment().tz('Asia/Ho_Chi_Minh').format()
          }
        ]
      })
      newpostcomments.save()
      res.json({ success: true, message: `Create new Comment document for post: ${newpostcomments.postId}` })
    }
    // else push new comment into the doc
    else {
      const newcomment = {
        userId: req.user.userId,
        comment: comment,
        createdAt: moment().tz('Asia/Ho_Chi_Minh').format()
      }
      postcomments.comments.push(newcomment)
      postcomments.save()
      res.json({ success: true, message: `Added new Comment to post: ${postId}` })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Something wrongs' })
  }
})

//route api/post/getall
//Get all posts with queries of creator, userId, topic and season
router.get('/getall', async (req, res) => {
  // find by categoryId, title & department
  const categoryId = req.query.categoryId || ''
  const title = req.query.title || ''
  const department = req.query.department || ''

  // return doc per page
  const pageSize = 5
  // current page
  const page = Number(req.query.pageNumber) || 1;

  // show hotest || latest || default
  const shownby = req.query.shownby || ''

  // filters
  const categoryIdFilter = categoryId ? {categoryId: {$regex: categoryId, $options: 'i'}} : {}
  const titleFilter = title ? {title: {$regex: title, $options: 'i'}} : {}
  const departmentFilter = department ? {department: {$regex: department, $options: 'i'}} : {}

  const creator = req.query.creator;
  const creatorQuery = creator ? { creator: { $regex: new RegExp(creator), $options: "i" } } : {};

  const userId = req.query.userId;
  const idQuery = userId ? { userId: { $regex: new RegExp(userId), $options: "i" } } : {};

  const topic = req.query.topic;
  const topicQuery = topic ? { topic: { $regex: new RegExp(topic), $options: "i" } } : {};

  const season = req.query.season;
  const seasonQuery = season ? { season: { $regex: new RegExp(season), $options: "i" } } : {};

  Article.find(creator ? creatorQuery : userId ? idQuery : topic ? topicQuery : season ? seasonQuery : {})
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