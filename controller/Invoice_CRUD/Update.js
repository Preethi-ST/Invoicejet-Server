const Invoice = require('../../models/Invoice')

module.exports = Update = async (req,res,next) => {
    try{
        const invoiceNo = req.params.invoiceNo

        const {products} = req.body
        const invoice = await Invoice.findOne({invoiceNo})
        invoice.products = products
        await invoice.save()
        res.json({
            success : true,
            invoice
        })
    }catch(error){
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
}