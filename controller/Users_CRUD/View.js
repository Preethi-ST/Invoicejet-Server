const User = require('../../models/User')

module.exports = View = async (req,res,next) => {
    try {
        const users_data = await User.find({ role: {$in: ['admin','manager','employee']}},'fname lname email role')
        const clients = await User.find({role:'client'},'fname lname email role')
        const users = req.currentUser.role === 'employee' ? [] : users_data
        return res.status(200).json({
            success : true,
            users,
            clients 
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message || error
        })
    }

}