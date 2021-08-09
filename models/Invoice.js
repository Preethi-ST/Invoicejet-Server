const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    invoiceNo : {
        type : String,
        unique : true
    },
    products : [
        {
            description : String,
            quantity : Number,
            tax : Number,
            price : Number
        }
    ],
    clientName : String,
    clientEmail : {
        type : String,
        required : true,
        match : [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid Email"
        ]
    },
    address : {
        door : String,
        city : String,
        state : String,
        zip : String
    },
},{timestamps : true})

const Invoice = mongoose.model('Invoice',invoiceSchema)
module.exports = Invoice