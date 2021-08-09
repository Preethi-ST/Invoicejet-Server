const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : true,
        min : 4
    },
    lname : {
        type : String,
        required : true,
        min : 4
    },
    email : {
        type : String,
        required : true,
        unique : [true,"This email was already taken. Try another"],
        match : [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid Email"
        ]
    },
    password : {
        type : String,
        required: true,
    },
    role : {
        type : String,
        default : 'employee',
        enum : ["admin","manager","employee","client"]
    },
    address : {
        door : String,
        city : String,
        state : String,
        zip : String
    },
    isActivated : {
        type : Boolean,
        default : false
    },
    accountActivateToken : String,
    accountActivateExpire : Date,
    resetPasswordToken : String,
    resetPasswordExpire : Date,
},{timestamps : true})

/* Hash password before saving to database */
userSchema.pre('save', async function(next){

    if(!this.isModified('password')) next();

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.getAccActivateToken = async function(){
    const activateToken =  jwt.sign(
        {email : this.email},
        process.env.JWT_SECRET,
        {expiresIn : '2d'}
    )

    this.accountActivateToken = activateToken;
    this.accountActivateExpire = new Date(+new Date() + 2*24*60*60*1000);

    return activateToken
}

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getToken = async function(){
    return jwt.sign(
        {email : this.email},
        process.env.JWT_SECRET,
        {expiresIn : '1d'}
    )
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(50).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * (60*1000);
    return resetToken;
}

const User = mongoose.model('User',userSchema)
module.exports = User