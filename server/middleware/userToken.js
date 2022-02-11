const jwt = require('jsonwebtoken')

const verifyUserToken = (req, res,next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) 
    return res
    .status(401)
    .json({sucess: false, message: 'Access Token Not Found'})

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        req.email = decoded.email
        req.faculty = decoded.faculty
        req.role = decoded.role
        next()
    } catch (err) {
        console.log(err)
        return res.status(403).json({success: false, message: err.message})
    }
}

module.exports = verifyUserToken