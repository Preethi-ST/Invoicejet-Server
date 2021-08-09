const Invoice = require('../models/Invoice')
const User = require('../models/User')
module.exports = Dashboard = async (req,res,next) => {
    try{
        const total_client = await User.find({role : 'client',isActivated : true})
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        //console.log(today);created: {$gte: today}}await details.countDocuments()
        let today_count = await Invoice.find({createdAt : {$gte : today}})
        const total_count = await Invoice.countDocuments();

        return res.status(200).json({
            success : true,
            today_count : today_count.length,
            total_count,
            total_client :total_client.length
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}