const Invoice = require('../../models/Invoice')


exports.allinvoice = async (req,res,next) => {
    const invoice_number = req.query.invoiceno
    try {
        let invoices;
        if(invoice_number){
            invoices = await Invoice.find({invoiceNo : invoice_number})
        }else{
            invoices = await Invoice.find({})
        }
        
        if(!invoices){
            return res.status(200).json({
                success : true,
                message : 'No Invoice in database'
            })
        }
        return res.status(200).json({
            success : true,
            invoices 
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}
exports.yourinvoice = async (req,res,next) => {
    const user = req.currentUser
    const invoice_number = req.query.invoiceno
    try {
        let invoices;
        
        if(user.role === 'client' && invoice_number){
            invoices = await Invoice.find({invoiceNo : invoice_number,clientEmail:user.email})
        }else if(user.role === 'client'){
            invoices = await Invoice.find({clientEmail:user.email})
        }else{
            console.log('No invoice')
        }
        
        if(!invoices.length){
            return res.status(404).json({
                success : true,
                message : 'No Invoice in database'
            })
        }
        return res.status(200).json({
            success : true,
            invoices 
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}