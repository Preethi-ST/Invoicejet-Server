const User = require('../../models/User')
const jwt = require('jsonwebtoken')
exports.Login = async (req,res,next) => {
    
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success : false,
                error : 'Inavlid Credentials'
            })
        }else{
            /* Check if password matches */
            const isMatch = await user.matchPassword(password)
            if(!isMatch){
                return res.status(401).json({
                    success : false,
                    error : 'Inavlid Credentials'
                })
            }
        }
        /* If isActivated -false , then user is logging in for the 1st time. So, need to reset password */
        if(!user.isActivated){
            
            const activateAccToken = await user.getAccActivateToken()
            await user.save()

            return res.status(200).json({
                success : true,
                message : 'User not active. Need to reset password after first login',
                activateAccToken
            })
        } else{

           /* Generate Token to enter protected Route */

            const token = await user.getToken()
            const {password, ...loggedin_user} = user._doc

            res
            .cookie("token",token,{ 
                expires: new Date(new Date().getTime() + 24 * 3600 * 1000),  
                httpOnly : true,
                secure : true,
                sameSite : "none" 
            })
            .status(200)
            .json({
                success : true,
                message : "Login Success",
                loggedin_user,
            })
            
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}

exports.activateAccount = async (req,res,next) => {

    try {
        const user = await User.findOne({
            accountActivateToken : req.params.activateToken,
            accountActivateExpire : { $gt : Date.now() }
        })
    
        if(!user){
            return res.status(401).json({
                success : false,
                error : "Password update failed"
            })
        }
    
        user.password = req.body.password;
        user.isActivated = true;
        user.accountActivateToken = undefined;
        user.accountActivateExpire = undefined;
    
        await user.save();
    
        return res.status(201).json({
            success: true,
            message: "Password Updated Success",
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }

}

exports.isLoggedIn = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                success :false,
                error : 'Not authorized for this route - Login Failed'
            })
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        const loggedin_user = await User.findOne({email : verified.email},'-_id fname lname email role')
        return res
        .status(200)
        .json({
            success : true,
            loggedin_user
        })
    } catch (error) {
        console.log(error)
        return res.json({success : false})
    }
}

exports.Logout = async (req,res,next) => {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    })
    .status(200)
    .send({
        success : true
    });
}
    