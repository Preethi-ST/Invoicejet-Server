const User = require("../../models/User");

module.exports = Registration = async (req,res,next) => {
    const {fname,lname,email,password,role,address} = req.body;
    
    try {
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success : false,
                error : 'Email was already taken. Try another'
            })
        }

        user = new User({fname,lname,email,password,role,address})

        user = await user.save();

        return res.status(200).json({
            success : true,
            message : "Registered Successfully. Share the credentials with the respective user. On initial login they will be prompted to reset password",
        })
    } catch (error) {
        return res.status(500).send({
            success : false,
            error: error.message
        })
    }
}