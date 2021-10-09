require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const Post = require('../newmodels/Post')
const User = require('../newmodels/User')
const Comment = require('../newmodels/Comment')
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
  const pageSize = 2
  // current page
  const page = Number(req.query.pageNumber) || 1;

  // show hotest = lay bai co like cao nhat || latest = lay bai dang gan day nhat|| default = lay bang id
  const shownby = req.query.shownby || ''

  // filters
  const categoryIdFilter = categoryId ? { categoryId: categoryId } : {}

  const titleFilter = title ? { title: { $regex: title, $options: 'i' } } : {}

  const departmentFilter = department ? { department: { $regex: department, $options: 'i' } } : {}


  // const retrieveCategoryname = {$ref: "category", $db: "categories"}
  const retrieveCategoryname = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'categoryinfo'
    }
  }

  const retrieveComment = {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'postId',
      as: 'comments'
    }
  }
  const shownOrder =
    shownby === 'hotest' ? { likes: -1 }
      : shownby === 'latest' ? { createdAt: -1 }
        : { _id: -1 }
  const total = await Post.find(categoryId ? categoryIdFilter : title ? titleFilter : department ? departmentFilter : {})

  const post = await Post.aggregate([retrieveCategoryname, retrieveComment]).match(categoryId ? categoryIdFilter : title ? titleFilter : department ? departmentFilter : {})
    .sort(shownOrder)
    .skip(pageSize * (page - 1)).limit(pageSize)
    .then(data => {
      // posts la thong tin cac bai tra ve
      // page la trang dang o
      // pages la tong so trang = tong so bai / so luong bai moi trang (lam tron len)
      res.send({ posts: data, page, pages: Math.ceil(total.length / pageSize) });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Error when filtering : ${categoryId ? categoryId : '' || title ? title : '' || department ? department : ''}.`
      });
    });
})

// Statistic APIs (later)

//route api/post/countAll
//Count All current post
router.get('/countall', async (req, res) => {
  const department = req.query.department || ''
  const categoryId = req.query.categoryId || ''

  const departmentFilter = department ? { department: { $regex: department, $options: 'i' } } : {}
  const categoryIdFilter = categoryId ? { categoryId: categoryId } : {}

  Post.find(department ? departmentFilter : categoryId ? categoryIdFilter : {}).countDocuments()
    .then(data => {
      if (data === 0) {
        res.json({ success: false, count: data, message: 'No post found to count' })
      } else res.json({ success: true, count: data })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message:
          err.message || `Cannot count the posts by ${categoryId ? `category Id: ${categoryId}` : ''} ${department ? `department ${department}` : ''}. Try again.`
      });
    });
})

module.exports = router