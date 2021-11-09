require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
// const User = require('../models/User')
const User = require('../newmodels/User')
const forgotPassMail = require('../middleware/forgotPassMail')
const verifyUserToken = require('../middleware/userToken')
const { isAuth } = require('../middleware/utils')

//route api/user/userWithArticle
//count user that submitted article
router.get('/getuserwpost', async (req, res) => {
    const department = req.query.department || ''
    const departmentFilter = department ? { department: { $regex: department, $options: 'i' } } : {}

    User.find({ $and: [departmentFilter, { posts: { $exists: true, $not: { $size: 0 } } }] }).countDocuments()
        .then(data => {
            res.json({ success: true, count: data })
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message:
                    err.message || "Error retrieving user with post"
            });
        });
})

//route api/user/getall
//Get all user with sort 
router.get('/getall', async (req, res) => {
    const department = req.query.department || ''
    const departmentFilter = department ? { department: { $regex: department, $options: 'i' } } : {}

    const role = req.query.role || '';
    const roleFilter = role ? { role: { $regex: role, $options: "i" } } : {};

    // return doc per page
    const pageSize = 10
    // current page
    const page = Number(req.query.pageNumber) || 1;

    const total = await User.find({ $and: [departmentFilter, roleFilter] })


    User.find({ $and: [departmentFilter, roleFilter] }).skip(pageSize * (page - 1)).limit(pageSize)
        .then(data => {
            const returndata = [];
            [...data].forEach((d) => {
                switch (d.role) {
                    case 'admin': {
                        break;
                    }
                    default:
                        {
                            const tempdata = {
                                _id: d._id,
                                email: d.email,
                                department: d.department,
                                role: d.role
                            }
                            returndata.push(tempdata);
                        }
                }

            })
            res.json({ success: true, data: returndata, page, pages: Math.ceil(total.length / pageSize) })
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message:
                    err.message || "Cannot get all users by query."
            });
        });
})

//route api/user/sendemailforgotpassword
//Send mail to retrieve password
router.post('/sendemailforgotpassword', async (req, res) => {
    const { email } = req.body

    if (!email) return res.status(400).json({ success: false, message: 'Xin hãy nhập mail' })

    if (!validateEmail(email))
        return res.status(400).json({ success: false, message: 'email does not meet requirement' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: 'Email Chưa được đăng kí' })

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })

    forgotPassMail(email, accessToken)

    res.json({ success: true, message: 'Nhận email thành công', accessToken, email })
})

//route api/user/retrievePassword
//Update User Password from Email
router.put('/retrievePassword', verifyUserToken, async (req, res) => {
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    //get current user
    const user = await User.findById(userId);

    if (user) {
        const hashedPassword = await argon2.hash(newPassword)
        user.password = hashedPassword || user.password;

        const UpdatedPasword = await user.save();
        res.send({ message: 'User Updated', newPass: UpdatedPasword, success: true });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
})

//route api/user/changePassword
//Change User Password
router.post('/changePassword', verifyUserToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body

    try {
        //get current user
        const user = await User.findOne({ _id: req.userId })

        //Find user in DB
        if (!user)
            return res.status(500).json({ success: false, message: 'User not found' })

        const passwordValid = await argon2.verify(user.password, currentPassword)

        //Check if Password correctly input
        if (!passwordValid)
            return res.json({ success: false, message: 'Password Incorrect' })

        //if all good 
        const hashedPassword = await argon2.hash(newPassword)

        //Update Password
        User.findByIdAndUpdate({ _id: req.userId }, { password: hashedPassword }, { useFindAndModify: false })
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
        res.status(500).json({ success: false, message: err.message })
    }
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router