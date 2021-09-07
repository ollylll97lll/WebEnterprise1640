const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {

    const authorization = req.header('Authorization')
    // const token = authHeader && authHeader.split(' ')[1]
    if (authorization) {
        // const token takes from the 7th index.
        // ex:
        //Bearer XXXXXX
        const token = authorization.slice(7, authorization.length);
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = decoded;
            next()
        } catch (err) {
            console.log(err)
            return res.status(403).json({ success: false, message: err.message })
        }

    } else {
        res.status(401).send({ message: 'No Token' });
    }
}

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Token. U no Admin' });
    }
}

module.exports = { isAdmin, isAuth }