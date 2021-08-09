const jwt = require('jsonwebtoken')
const User = require('../models/User')
module.exports = isAuthorized = async (req,res,next) => {
    
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success :false,
                error : 'Not authorized for this route'
            })
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        const loggedin_user = await User.findOne({email : verified.email},'-_id fname lname email role')
        req.currentUser = loggedin_user
        next()

    } catch (error) {
        return res.status(401).json({
            success :false,
            error : 'Not authorized for this route'
        })
    }
}