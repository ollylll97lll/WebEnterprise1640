require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
// const User = require('../models/User')
const User = require('../newmodels/User')
const forgotPassMail = require('../middleware/forgotPassMail')
const verifyUserToken = require('../middleware/userToken')
const { isAuth, isAdmin, isStatisticRole } = require('../middleware/utils')
const Departments = require('../newmodels/Departments')
const mongoose = require('mongoose');

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

// route api/user/getone
// get user data
router.post('/getone', isAuth, async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(201).json({ success: false, message: 'User not found' })
    }
    await User.findById(userId).then(data => {
        return res.status(200).json({ success: true, data: { email: data.email, department: data.department, role: data.role } })
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
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

// ROUTE api/user/deleteUser
router.delete('/deleteUser', isAuth, isAdmin, async (req, res) => {
    const { userId } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await User.findByIdAndDelete(userId)
            .session(session);
        if (result.n === 0 || result.nModified === 0) {
            return res.status(400).json({ success: false, message: 'No User found or some error occur when deleting User', result })
        }
        if (!result.departmentId) {
            return res.status(400).json({ success: false, message: 'Old User w no DepartmentId' });
        }
        // else {
        const decreasedTotalinDep = await Departments.findByIdAndUpdate(result?.departmentId, { $inc: { totalStaff: -1 } })
            .session(session);
        if (!decreasedTotalinDep) {
            return res.status(400).json({ success: false, message: 'Cannot Update Department. Try again' })
        }
        await session.commitTransaction();
        res.status(201).json({ success: true, message: 'Deleted', result })
        return session.endSession();
        // }
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, error: error || 'No user found' })
        return session.endSession();
    }
})

// ROUTE api/user/updateUser
router.patch('/updateUser', isAuth, isAdmin, async (req, res) => {
    const { userId, departmentId, role } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    if (!departmentId || !role) {
        res.status(400).send('No new data sent to update');
        return session.endSession();
    }
    if (role === 'admin') {
        res.status(401).send('You are not authorized to Update any user to admin')
        return session.endSession();
    }

    try {
        let updatedat = {}
        const userolddat = await User.findById(userId);
        // no user
        if (!userolddat) {
            return res.status(400).send("No User");
        }
        // res.send(userolddat);

        // same department
        if (userolddat.departmentId === departmentId) {
            updatedat = {
                role: String(role).toLowerCase()
            }
            const result = await User.findByIdAndUpdate(userId, updatedat).session(session);

            if (!result) {
                res.status(400).json({ success: false, message: 'Somthing Wrong Updating User' })
                await session.abortTransaction();
                return session.endSession();
            }
            await session.commitTransaction();
            res.status(200).json({ success: true, message: `User ${userId} updated`, result })
            return session.endSession();
        }
        // not same department
        // update department
        else {
            // using old departmentId
            await Departments.findByIdAndUpdate(userolddat.departmentId, { $inc: { totalStaff: -1 } }).session(session);
            // using req.body departmentId
            const newdep = await Departments.findByIdAndUpdate(departmentId, { $inc: { totalStaff: 1 } }).session(session);

            updatedat = {
                department: newdep.name,
                role: String(role).toLowerCase(),
                departmentId: newdep._id
            }

            const result = await User.findByIdAndUpdate(userId, updatedat).session(session);
            if (newdep && result) {
                await session.commitTransaction();
                res.status(200).json({ success: true, message: `User ${userId} updated`, result, newdep })
            }
            else {
                await session.abortTransaction();
                res.status(400).json({ success: false, message: 'somthing error', session: session.id });
            }
            session.endSession();
            return
        }
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: 'Trycatch error', error, session: session.id });
        return session.endSession();
    }
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
module.exports = router

