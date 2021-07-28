const express = require('express')
const router = express.Router()

const Test = require('../models/Test')
const Post = require('../models/TestPost')

router.post('/createtestuser', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) 
    return res.status(400).json({success: false, message: 'Please enter username or password'})

    try {
        const testUser = await Test.findOne({username})

        if (testUser)
        return res.status(400).json({success:false, message: 'User existed'})

        const newUser = new Test({
            username,
            password,
            post: []
        })

        await newUser.save()

        res.json({success: true, message: 'User Created', userInfo: newUser})
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

router.post('/createpost', async (req, res) => {
    const {title, message} = req.body

    try {
        const user = await Test.findOne({_id: '6101234ca11ebb0380f222c0'})
        const post = new Post({title: title, message: message})

        user.post.push(post)

        user.save()

        res.json({success: true, message: 'OK', user})
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

module.exports = router