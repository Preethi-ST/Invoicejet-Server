exports.roleAuth = (Permissions) => {
    return (req,res,next) => {
        if(Permissions.includes(req.currentUser.role)){
            next()
        }else{
            return res.status(401).json({
                success : false,
                error : "You don't have access"
            })
        }
    }
}