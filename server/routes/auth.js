require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const User = require('../models/User')

//route Post api/auth/register
//Register for user
router.post('/register', async (req, res) => {
    const {email, password, faculty, role} = req.body

    //validation for inputs
    if (!email || !password) 
    return res.status(400).json({success: false, message: 'Please enter your email or password'})

    if (!faculty)
    return res.status(400).json({success: false, message: 'Please enter a Faculty for the User'})

    if (!role)
    return res.status(400).json({success: false, message: 'Please enter a Role for the User'})

    try {
        //Check if the user existed in DB
        const user = await User.findOne({email})

        if (user) 
        return res.status(400).json({success:false, message: 'The Account Already Existed'})

        //Hash password
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            email,
            password: hashedPassword,
            status: false,
            faculty,
            role
        })

        await newUser.save()

        const accessToken = jwt.sign({ userId: newUser._id, email, faculty, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })

        res.json({success:true, message: "User created successfully", accessToken: accessToken, userInfo: newUser})
    } catch (err) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route POST api/auth/login
//User login
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) 
    return res.status(400).json({success: false, message: 'Please enter your email or password'})

    try {
        //Find if User Existed
        const user = await User.findOne({email})

        //If User not found
        if (!user)
        return res.status(400).json({success: false, message: 'User Not Existed'})

        //If User found
        const passwordValid = await argon2.verify(user.password, password)
        
        if (!passwordValid)
        return res.status(400).json({success: false, message: 'Wrong Password'})

        //All good
        const accessToken = jwt.sign({ userId: user._id, email, faculty: user.faculty }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })

        res.json({success:true, message: "Sign In Successfully", accessToken: accessToken, userInfo: user})
    } catch {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

module.exports = router