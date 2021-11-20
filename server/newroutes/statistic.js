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
    const today = new Date()
    // chart
    // tổng user dept/ tổng
    const totalDepttUser = await User.find({ departmentId: req.user.departmentId }).countDocuments();
    // tổng post /ngày của dept đó
    const totalPostToday = await Post.find({ createdAt: { $gte: today.setHours(0, 0, 0, 000), $lte: today.setHours(23, 59, 59, 000) } }).countDocuments();
    // % tổng post của dept đó trên tổng post
    const totalPosts = await Post.countDocuments();
    const DepartmentPosts = await Post.find({ department: req.user.department }).countDocuments();
    const percentageDeptPost = `${Number((DepartmentPosts / totalPosts) * 100).toFixed(2)}%`
    // line chart:
    // sô post của dept đó theo ngày
    const dailyPosts = await Post.aggregate([
        {
            $match: {
                createdAt: {
                    $lt: today,
                    $gt: moment().subtract(7, 'days')._d
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                posts: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },

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
            tableinfo:
                [
                    {
                        title: 'User in department',
                        data: totalDepttUser
                    },
                    {
                        title: 'Total posts today',
                        data: totalPostToday
                    },
                    {
                        title: 'Total post',
                        data: totalPosts
                    },
                    {
                        title: 'Total post in department',
                        data: DepartmentPosts
                    },
                    {
                        title: '%Department post/Total post',
                        data: percentageDeptPost
                    }
                ]
            ,
            dailyPosts,
            PostGrouped
        });
})

// route api/statistic/cvsfiledata
// generate data for cvs file by department
router.get('/cvsfiledata', isAuth, isStatisticRole, async (req, res) => {
    const { department } = req.user;

    // const retrieveCategoryname = {$ref: "category", $db: "categories"}
    const retrieveCategoryname = {
        $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryinfo'
        }
    }
    const retrieveUserEmail = {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userinfo'
        }
    }
    const matchUserDepartment = {
        $match: {
            department: department
        }
    }

    await Post.aggregate([retrieveCategoryname, retrieveUserEmail, matchUserDepartment]).then(data => {
        let returndata = [];
        try {
            [...data].map(d => {
                const tempdata = {
                    _id: d._id,
                    email: d.userinfo[0].email,
                    title: d.title,
                    category: d.categoryinfo[0].name,
                    content: d.content,
                    likes: d.likes,
                    files: d.docfolder ? 'Yes' : 'No',
                    createdAt: d.createdAt,
                }
                returndata.push(tempdata);
            })
            res.send({ success: true, returndata });
        } catch (error) {
            res.send({ success: false, message: `trycatch ${error}` })
        }
    }).catch(err => {
        res.status(200).send({ success: false, message: `then catch ${err}` })
    })

})

module.exports = router
