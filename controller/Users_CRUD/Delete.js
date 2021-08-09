const User = require('../../models/User')
module.exports = Delete = async (req,res,next) => {

    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({
                success : true,
                error : 'No such user exists'
            })
        }
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success : true,
            message : 'User deleted'
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message || error
        })
    }
}