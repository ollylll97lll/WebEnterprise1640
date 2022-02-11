require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const moment = require('moment-timezone')

const User = require('../newmodels/User')
const Departments = require('../newmodels/Departments')

//route Post api/auth/register
//Register for user
router.post('/register', async (req, res) => {
    const { email, password, department, role, departmentId } = req.body

    //validation for inputs
    if (!email || !password || !departmentId)
        return res.status(400).json({ success: false, message: `Please enter your ${email ? ' email' : ''}${password ? ', password' : ''} ${departmentId ? ', department' : ''} ` })


    //check if mail actual valid
    if (!validateEmail(email))
        return res.status(400).json({ success: false, message: 'Email not valid' })

    if (!role)
        return res.status(400).json({ success: false, message: 'Please enter a Role for the User' })

    if (!department && role !== 'admin') {
        // if (role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Please enter a Department for the non admin User' })
        // }
    }

    try {
        //Check if the user existed in DB
        const user = await User.findOne({ email })

        const returndepartment = await Departments.findByIdAndUpdate(departmentId, { $inc: { totalStaff: 1 } })
        if (returndepartment.n === 0) {
            return res.status(404).json({ success: false, message: 'Cannot find the department to update' })
        }
        if (returndepartment.nModified === 0) {
            return res.status(400).json({ success: false, message: 'Either no department found to modified. Or the requests are not valid.' })
        }

        if (user)
            return res.status(400).json({ success: false, message: 'The Account Already Existed' })

        //Hash password
        const hashedPassword = await argon2.hash(password)
        let newUser = new User({});
        if (role === 'admin') {
            // admin k có department
            newUser = new User({
                email,
                password: hashedPassword,
                role,
                createdAt: moment().tz('Asia/Ho_Chi_Minh').format(),
                posts: [],
                likedposts: []
            })
        }
        else {
            newUser = new User({
                email,
                password: hashedPassword,
                department: department,
                departmentId: departmentId,
                role: role,
                createdAt: moment().tz('Asia/Ho_Chi_Minh').format(),
                posts: [],
                likedposts: []
            })
        }

        await newUser.save()

        const accessToken = jwt.sign({ userId: newUser._id, email, department, departmentId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })

        res.json({ success: true, message: "User created successfully", accessToken: accessToken, userInfo: newUser })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route POST api/auth/login
//User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({ success: false, message: 'Please enter your email or password' })

    try {
        //Find if User Existed
        const user = await User.findOne({ email })

        //If User not found
        if (!user)
            return res.status(400).json({ success: false, message: 'User Not Existed' })

        //If User found
        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid)
            return res.status(400).json({ success: false, message: 'Wrong Password' })

        //All good
        const accessToken = jwt.sign({ userId: user._id, email, department: user.department, departmentId: user.departmentId, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

        res.json({ success: true, message: "Sign In Successfully", accessToken: accessToken, userInfo: user })
    } catch {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router