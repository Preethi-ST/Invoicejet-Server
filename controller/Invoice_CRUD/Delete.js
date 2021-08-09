const Invoice = require('../../models/Invoice')

module.exports = Delete = async (req,res,next) => {
    try{
        const {invoiceNo} = req.body
        const invoice = await Invoice.findOne({invoiceNo})
        await invoice.delete()
        return res.status(200).json({
            success : true,
            message : 'Invoice deleted'
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}