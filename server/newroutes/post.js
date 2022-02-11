const uploadfolderName = './uploads'
require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const Post = require('../newmodels/Post')
const User = require('../newmodels/User')
const Comment = require('../newmodels/Comment')
const Category = require('../newmodels/Category')
const { isAuth, isAdmin } = require('../middleware/utils')
const { findById } = require('../newmodels/Post')
const Departments = require('../newmodels/Departments')
const { isValidObjectId } = require('mongoose')
const fs = require('fs');
const date = new Date();
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;

//route api/post/create
//Create Post for Student role
router.post('/create', isAuth, async (req, res) => {
  const { categoryId, title, content, docfolder } = req.body

  // title ad description validation
  if (!title)
    return res.status(500).json({ success: false, message: 'Fill the tittle' })
  if (!content)
    return res.status(500).json({ success: false, message: 'Fill the content' })
  if (!categoryId)
    return res.status(500).json({ success: false, message: 'Fill the categoryId' })

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
      department: req.user.department,
      docfolder: docfolder,
      likes: 0,
      createdAt: moment().tz('Asia/Ho_Chi_Minh').format()
    })
    await post.save()
    user.posts.push(post._id)
    user.save()

    res.json({ success: true, message: `Post Is Created. Title: ${post.title}`, postId: post._id })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err })
  }
})

// route api/post/delete
router.delete('/delete', isAuth, async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.send({ success: false, message: 'No PostId' });
  }
  try {
    const result = await Post.findOneAndDelete({ _id: postId, userId: req.user.userId })
    if (result) {
      // Delete The Folder W files
      const foldername = result.docfolder;
      const folder2del = `${uploadfolderName + '/' + foldername}`;
      if (!foldername || foldername == '') {
        return res.send({ success: true, result, message: 'Deleted successfully. Post do not have folder' })
      }
      else {
        try {
          fs.rmdirSync(folder2del, { recursive: true })
          return res.send({ success: true, result, message: 'Delete and remove folder successfully' })
        } catch (error) {
          return res.send({ success: false, error })
        }
      }
    }
    else return res.send({ success: false, message: 'no post found to delete' })

  } catch (error) {
    return res.send({ success: false, error })
  }
})

// count total like || dislike
function tl(islike, isdislike, react) {
  // unlike
  if (islike && react === 'like') {
    // 1 => 0 
    return -1;
  }
  // undislike
  if (isdislike && react === 'dislike') {
    // -1 => 0
    return 1;
  }
  // from dislike to like
  if (isdislike && !islike && react === 'like') {
    // -1 => 0 => 1
    return 2
  }
  // from like to dislike
  if (islike && !isdislike && react === 'dislike') {
    //  1 => 0 => -1
    return -2
  }
  // like
  if (react === 'like' && !islike) {
    // 0 => 1
    return 1;
  }
  // dislike
  if (react === 'dislike' && !isdislike) {
    // 0 => -1
    return -1;
  }
};

// route api/post/getlikefrpost
// get all likedposts from user & set the state to each post
router.post('/getlikefrpost', isAuth, async (req, res) => {
  const { postId } = req.body;
  const userId = req.user?.userId;

  if (!postId) {
    res.send('No post Id sent');
  }
  try {
    const isPostLikey = await User.findOne({ _id: userId, likedposts: { $elemMatch: { postId: postId } } }, { likedposts: { $elemMatch: { postId: postId } } })
    res.status(200).send(isPostLikey?.likedposts[0]);

  } catch (error) {
    res.status(201).send(error)
  }

})


function newlikestate(islike, isdislike, reaction) {
  // unlike
  if (islike && reaction === 'like') {
    return {
      like: false,
      dislike: false
    };
  }
  // undislike
  if (isdislike && reaction === 'dislike') {
    // -1 => 0
    return {
      like: false,
      dislike: false
    };
  }
  // from dislike to like
  if (isdislike && !islike && reaction === 'like') {
    // -1 => 0 => 1
    return {
      like: true,
      dislike: false
    }
  }
  // from like to dislike
  if (islike && !isdislike && reaction === 'dislike') {
    //  1 => 0 => -1
    return {
      like: false,
      dislike: true
    }
  }
  // like
  if (reaction === 'like' && !islike) {
    // 0 => 1
    return {
      like: true,
      dislike: false
    }
  }
  // dislike
  if (reaction === 'dislike' && !isdislike) {
    // 0 => -1
    return {
      like: false,
      dislike: true
    }
  }
}
// route api/post/likey/:postId
// like post = create || modified user.likedposts then add into Post totallikes
router.post('/likey/:postId', isAuth, async (req, res) => {

  const postId = req.params.postId;
  // get state from post
  const { islike, isdislike, reaction } = req.body
  const userId = req.user.userId;
  const totallikes = tl(islike, isdislike, reaction);

  // check user
  const user = await User.findById(userId);
  if (!user) {
    res.status(400).json({ success: false, message: `cannot find user ${userId}` })
  }
  const newlikey = newlikestate(islike, isdislike, reaction);

  try {
    const likedpost = {
      postId: postId,
      like: newlikey.like,
      dislike: newlikey.dislike
    }


    // 1st Part
    // update likes by users
    const result = await User.updateOne(
      {
        _id: userId,
        'likedposts.postId': postId
      },
      {
        $set: {
          "likedposts.$": likedpost
        }
      }
    )

    // if no record found. add new to the doc
    if (result.n === 0) {
      const user = await User.updateOne({ _id: userId },
        {
          $addToSet: { likedposts: likedpost }
        }
      )
    }

    // 2nd Part
    // count the like and update in the Post total likes
    const uplike = await Post.updateOne({ _id: postId },
      {
        $inc: { likes: totallikes }
      }
    )
    if (uplike.n === 0) {
      res.status(400).json({ success: false, message: 'uplike failed for there was no post found.' })
      // TODO: NO POST => DEL USER LIKEDPOSTS RECORD WITH THIS POSTID
    }
    let msg = `user ${req.user.email} just ${reaction + 'd'} post ${postId}. Updated Type: ${result.n === 0 ? 'create new' : 'update'}`
    res.status(200).json({ success: true, message: msg })


  } catch (error) {
    res.status(500).json({ success: false, message: error || 'Something Wrong' })
  }
})

//route api/post/comment
//Add comment in a post
router.post('/comment', isAuth, async (req, res) => {
  const { postId, comment, isAnonymous } = req.body

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
            email: req.user.email,
            comment: comment,
            createdAt: moment().tz('Asia/Ho_Chi_Minh').format(),
            isAnonymous: isAnonymous
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
        email: req.user.email,
        comment: comment,
        createdAt: moment().tz('Asia/Ho_Chi_Minh').format(),
        isAnonymous: isAnonymous
      }
      postcomments.comments.push(newcomment)
      postcomments.save()
      res.json({ success: true, message: `Added new Comment to post: ${postId}` })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err })
  }
})
// delete single cmt of the post
router.delete('/deletecommentpost', isAuth, async (req, res) => {
  const { postId, commentId } = req.body;
  if (!postId) {
    res.status(404).send('No PostId')
  }
  if (!commentId) {
    res.send('No Comment Id')
  }
  const result = await Comment.updateOne({ postId: postId },
    {
      $pull:
      {
        comments:
        {
          _id: commentId,
          userId: req.user.userId
        }
      }
    })
  if (result.n === 0 || result.nModified === 0) {
    res.status(404).send('No cmt found 2 del')
    return
  }
  if (result.nModified === 1) {
    res.status(200).json({ success: true, message: 'Deleted cmt' })
    return
  }
  else {
    res.status(400).send('Smthing Wrong bro')
    return
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
  const retrieveCmts = {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'postId',
      as: 'cmtinfo'
    }
  }
  const shownOrder =
    shownby === 'hotest' ? { likes: -1 }
      : shownby === 'latest' ? { createdAt: -1 }
        : { _id: -1 }
  const total = await Post.find(categoryId ? categoryIdFilter : title ? titleFilter : department ? departmentFilter : {})

  const post = await Post.aggregate([retrieveCategoryname, retrieveCmts]).match(categoryId ? categoryIdFilter : title ? titleFilter : department ? departmentFilter : {})
    .sort(shownOrder)
    .skip(pageSize * (page - 1)).limit(pageSize)
    .then(async (data) => {
      // get total cmts
      data.map(d => {
        const totalcmts = d.cmtinfo[0]?.comments.length || 0;
        delete d.cmtinfo;
        d.totalcmts = totalcmts;
      })

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

// route/api/post/gethistorypost
// get post list for history page
router.get('/gethistorypost', isAuth, async (req, res) => {
  const { categoryId } = req.query;
  // return doc per page
  const pageSize = 5
  // current page
  const page = Number(req.query.pageNumber) || 1;

  const retrieveCategoryname = {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'categoryinfo'
    }
  }

  const usermatching = {
    $match: {
      userId: new ObjectId(req.user.userId)
    }
  }
  const catmatching = {
    $match: {
      categoryId: new ObjectId(categoryId)
    }
  }

  try {
    const result = await Post.aggregate([usermatching, catmatching, retrieveCategoryname])
      .skip(pageSize * (page - 1))
      .limit(pageSize).then(data => {
        res.send({ success: true, data })
      })

  } catch (error) {
    res.send({ success: false, error: `${error}` })
  }

})

// route/api/post/getpostdetail
// get one post details
router.post('/getpostdetail', async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.status(404).send('No PostId found to query.')
  }

  const result = await Post.findById(postId)
  const catdetail = await Category.findById(result?.categoryId);
  const cmts = await Comment.findOne({ postId: postId });
  return res.status(200).json({
    result, catdetail, cmts: cmts ? [...cmts.comments] : []
  })


})

// route api/post/getAllDepartment
// get all department
router.get('/getAllDepartment', async (req, res) => {
  try {
    const result = await Departments.find({});
    res.status(201).json({ message: 'Success', departments: result });
  } catch (error) {
    res.status(400).send('Something Wrong')
  }
})

// route api/post/postDepartment
// get all department
router.post('/postDepartment', isAuth, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await Departments.create({
      name: name,
      totalStaff: 0
    })
    res.status(201).json({ message: 'Success', departments: result });
  } catch (error) {
    res.status(400).send('Something Wrong')
  }
})
// route api/post/delDepartment
// delete department
router.delete('/delDepartment', isAuth, isAdmin, async (req, res) => {
  const { departmentId } = req.body;
  if (!departmentId) {
    return res.status(200).send('No department Id found')
  }
  try {
    const fetchTotalStaff = await Departments.findById(departmentId);
    if (!fetchTotalStaff) {
      return res.status(400).json({ success: false, message: 'No Department Found' })
    }
    if (fetchTotalStaff.totalStaff !== 0) {
      return res.status(400).json({ success: false, message: 'There are staffs in this department. Abort Delete Request' })
    }

    const result = await Departments.findByIdAndDelete(departmentId);
    return res.status(200).json({ success: true, result, message: 'Deleted Successfully' })

  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})
//route api/post/edit
router.patch('/edit', isAuth, async (req, res) => {
  if (req.user.role !== 'staff') {
    return res.json({ success: false, message: 'U no Staff' })
  }
  const { postId } = req.query;
  const userId = req.user.userId;
  const { title, content } = req.body;

  const checkpost = await Post.findOne({ _id: postId, userId: userId });

  const checkowner = await User.findOne({ _id: userId, posts: { $elemMatch: { _id: postId } } });

  if (!checkowner) {
    return res.json({ success: false, message: 'You are not Post Owner.', checkowner, user: req.user })
  }
  if (!checkpost) {
    return res.json({ success: false, message: 'There were no Post found', checkpost, user: req.user })
  }


  await Post.findByIdAndUpdate(postId, req.body).then(result => {
    return res.status(200).json({ success: true, result, message:'Edited successfully' })
  }).catch(err => {
    return res.status(400).json({ success: false, err })
  })
})

module.exports = router