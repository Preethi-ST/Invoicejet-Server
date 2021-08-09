const User = require('../../models/User')
const sendEmail = require('../../helpers/sendMail')

module.exports = ForgotPassword = async (req,res,next) => {
    const {email} = req.body

    try{
        const user = await User.findOne({email,isActivated : true})
        if(!user){
            return res.status(400).json({
                success : false,
                error : 'Invalid Credentials'
            })
        }
        /* Generate Reset Token */
        const resetToken = await user.getResetPasswordToken()
        await user.save()

        const resetURL = `${process.env.FE_URL}/Invoicejet/resetpassword/${resetToken}`

        const message = 
        `
        <p>Hello ${user.fname},</p>
        
        <h1>You have requested to reset your password</h1>

        <p>Click on the below link to reset your password</p>
        <a href=${resetURL}>${resetURL}</a>

        <p> Link will be <strong>valid</strong> only for <strong>10 minutes </strong> </p>

        <p>${process.env.EMAIL_OWNER}</p>




        
        <p>Thanks & Regards,</p>
        <p>Invoicejet Team</p>
        `
        /* Send Mail */
        try{
            await sendEmail({
                to : email,
                cc : null,
                subject : "Invoicejet - Password Reset",
                text : message
            })
            return res.status(200).json({success:true,message : "Email Sent! Make sure to check your spam mail and mark not as spam."})
        }catch(error){
            console.log(error)
            return res.status(500).json({success:false,error : "Email couldn't be sent"})
        }
    }catch(error){
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}