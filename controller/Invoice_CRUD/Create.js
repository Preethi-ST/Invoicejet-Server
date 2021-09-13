const Invoice = require('../../models/Invoice')
const User = require('../../models/User')

const sendEmail = require('../../helpers/sendMail')
module.exports = Create = async (req,res,next) => {
    try{
        const {products,clientEmail} = req.body

        const client_user = await User.findOne({email : clientEmail,role : 'client'},'-_id fname lname email address')
        if(!client_user){
            return res.status(404).json({
                success:false,
                error : 'No client exists with the mentioned email! Add client details before creating Invoice'
            })
        }

        /* Get Manage,Admin email address */
        const usersList = await User.find(
            {role : {$in : ['admin','manager']}, isActivated : true},
            '-_id email' /* -(hyphen) excludes that column and only email column will be selected */
        )
        const userList = usersList.map(user => user.email)
        const address = client_user.address

        /* Save Invoice details in the DB */
        const newInvoice = new Invoice({
            invoiceNo : `INV${Date.now().toString()}`,
            products,
            clientName : client_user.fname,
            clientEmail,
            address 
        })

        newInvoice.save()

        const message = `
        <p style="color : rgb(35, 23, 196)">Dear <strong>${client_user.fname}</strong>,</p>
        <h3 style="color:green">Your Invoice has been created Successfully</h3>

        <p style="color : rgb(35, 23, 196)">Invoice Number is ${newInvoice.invoiceNo}</p>

        <p style="color : rgb(35, 23, 196)">Kindly <a href = '${process.env.FE_URL}'>Login</a> to our website to see the invoice details.</p>

        <p>If you are logging-in for the first time, then our employees will share the necessary credentials with you over slack. 
        If not, you can login with the credentials you have </p>

        <p style="color : rgb(35, 23, 196)">Thanks for purchasing!</p>
        <pre>
        </pre>
        <p>Thanks & Regards,</p>
        <p>Invoicejet Team</p>
        `

        try{
            await sendEmail({
                to : client_user.email,
                cc : userList.join(),
                subject : `${newInvoice.invoiceNo} Generated`,
                text : message
            }) 
            return res.status(200).json({
                success:true,
                invoice : newInvoice
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({success:false,error : "Email couldn't be sent"})
        } 
    }catch(error){
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
}
