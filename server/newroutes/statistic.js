require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const moment = require('moment-timezone')

const User = require('../newmodels/User')
const Departments = require('../newmodels/Departments')
const { isManager, isAuth, isStatisticRole } = require('../middleware/utils')
const Post = require('../newmodels/Post')
const Category = require('../newmodels/Category')


router.get('/', isAuth, isStatisticRole, async (req, res) => {
    // chart
    // tổng user dept/ tổng
    const totalDepttUser = await User.find({ departmentId: req.user.departmentId }).countDocuments();
    // tổng post /ngày của dept đó
    const totalPostToday = await Post.find({ createdAt: { $gt: new Date('11/11/2021'), $lt: new Date('11/11/2021').setHours(23, 59, 59, 000) } }).countDocuments();
    // % tổng post của dept đó trên tổng post
    const totalPosts = await Post.countDocuments();
    const DepartmentPosts = await Post.find({ department: req.user.department }).countDocuments();
    const percentageDeptPost = `${Number((DepartmentPosts / totalPosts) * 100).toFixed(2)}%`

    // line chart:
    // sô post của dept đó theo ngày
    const dailyPosts = await Post.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
                posts: { $sum: 1 }
            }
        }
    ])
    // pie chart:
    // tổng số post của department đó theo tag
    const PostGrouped = await Post.aggregate([
        {
            $match: {
                department: req.user.department
            }
        },
        {
            $group: {
                _id: '$categoryId',
                posts: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'categorydetails'
            }
        }
    ])


    res.send(
        {
            success: true,
            totalDepttUser,
            totalPostToday,
            percentage: {
                totalPosts,
                DepartmentPosts,
                percentageDeptPost
            },
            dailyPosts,
            PostGrouped
        });
})

module.exports = router
