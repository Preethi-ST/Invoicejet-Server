const Invoice = require('../../models/Invoice')
module.exports = getInvoice = async (req,res,next) => {
    const invoiceNo = req.params.invoiceNo

    try {
        const invoice = await Invoice.findOne({invoiceNo})
        if(!invoice){
            return res.status(404).json({
                success :false,
                error : 'No such Invoice available'
            })
        }
        return res.status(200).json({
            success:true,
            invoice 
        })
    } catch (error) {
        return res.status(500).json({
            success :false,
            error : error.message
        })
    }
}