require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const User = require('../models/User')
const forgotPassMail = require('../middleware/forgotPassMail')
const verifyUserToken = require('../middleware/userToken')

//route api/user/userWithArticle
//count user that submitted article
router.get('/userWithArticle', async (req, res) => {
    User.find({article: {$exists : true, $not : {$size: 0}}}).countDocuments()
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

//route api/user/count_userFaculty_haveArticle
//count user that submitted article of an faculty
router.get('/count_userFaculty_haveArticle', async (req, res) => {

    const faculty = req.query.faculty;
    const condition = faculty ? { faculty: { $regex: new RegExp(faculty), $options: "i" } } : {};

    User.find({$and: [condition, {article: {$exists : true, $not : {$size: 0}}}]}).countDocuments()
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

//route api/user/getAll_user
//Get all user with sort of faculty and role
router.get('/getAll_user', async (req, res) => {
    const faculty = req.query.faculty;
    const facultyQuery = faculty ? { faculty: { $regex: new RegExp(faculty), $options: "i" } } : {};

    const role = req.query.role;
    const roleQuery = role ? { role: { $regex: new RegExp(role), $options: "i" } } : {};

    User.find({$and: [facultyQuery, roleQuery]})
    .then(data => {
        res.json({ success: true, data: data })
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message:
            err.message || "Some error occurred while retrieving forms."
        });
      });
})

//route api/user/forgotPassword
//Send mail to retrieve password
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body

    if (!email) return res.status(400).json({ success: false, message: 'Xin hãy nhập mail' })

    if (!validateEmail(email))
        return res.status(400).json({ success: false, message: 'Mail không tồn tại' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: 'Email Chưa được đăng kí' })

    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })

    forgotPassMail(email, accessToken)

    res.json({ success: true, message: 'Nhận email thành công', accessToken, email })
})

//route api/user/changePassword
//Change User Password
router.post('/changePassword', verifyUserToken, async (req, res) => {
    const {currentPassword, newPassword} = req.body

    try {
      //get current user
      const user = await User.findOne({_id: req.userId})

      //Find user in DB
      if(!user)
      return res.status(500).json({success: false, message: 'User not found'})

      const passwordValid = await argon2.verify(user.password, currentPassword)

      //Check if Password correctly input
      if(!passwordValid)
      return res.json({success: false, message: 'Password Incorrect'})

      //if all good 
      const hashedPassword = await argon2.hash(newPassword)

      //Update Password
      User.findByIdAndUpdate({_id: req.userId}, {password: hashedPassword}, { useFindAndModify: false })
      .then(data => {
        res.send({ success: true, message: "Password changed successfully." });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: 'Something wrong!!'
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({success: false, message: err.message})
    }
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router