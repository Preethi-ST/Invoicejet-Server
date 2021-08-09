const express = require('express');
const router = express.Router();

//Middleware - IMPORTS
const {roleAuth} = require('../middleware/roleAuth')
const isAuthorized = require('../middleware/isAuthorized');

//CUSTOM IMPORTS
const Create = require('../controller/Invoice_CRUD/Create');
const {allinvoice,yourinvoice} = require('../controller/Invoice_CRUD/allinvoice');
const Update = require('../controller/Invoice_CRUD/Update');
const Delete = require('../controller/Invoice_CRUD/Delete');
const getInvoice = require('../controller/Invoice_CRUD/getInvoice');

//create Invoice
router.post('/create',isAuthorized,roleAuth(['admin','manager','employee']),Create)

//get all ivoices, search by invoice
router.get('/allinvoice',isAuthorized,roleAuth(['admin','manager','employee']),allinvoice)

//get Invoice based on invoice No
router.get('/getInvoice/:invoiceNo',isAuthorized,roleAuth(['admin','manager','employee']),getInvoice)
//Client specific invoices
router.get('/myinvoice',isAuthorized,roleAuth(['client']),yourinvoice)
//update invoice

router.patch('/update/:invoiceNo',isAuthorized,roleAuth(['admin','manager','employee']),Update)

//delete Invoice
router.delete('/delete',isAuthorized,roleAuth(['admin','manager']),Delete)

module.exports = router