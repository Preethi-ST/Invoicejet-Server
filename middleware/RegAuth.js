exports.RegAuth = (Permissions) => {
    return (req,res,next) => {
        const userRole = req.currentUser.role;
        if(Permissions.includes(userRole)){
            if((userRole=== 'employee' && req.body.role === 'client') || (userRole !== 'employee')){
                next()
            }else {
                return res.status(401).json({
                    success : false,
                    error : "You don't have access"
                })
            }

        }else{
            return res.status(401).json({
                success : false,
                error : "You don't have access"
            })
        }
    }
}
