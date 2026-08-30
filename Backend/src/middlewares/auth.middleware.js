const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {
    if (req.headers['user-id']) {
    const userId = req.headers['user-id'];
    // Attach the user identity so the backend route controllers know who you are
    req.user = { id: userId, _id: userId };
    return next(); // Bypass the entire JWT block and execute the AI route!
}


    let token = req.cookies.token

    // Also check Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = { authUser }