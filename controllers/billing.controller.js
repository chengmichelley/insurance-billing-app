const express= require('express')
const router= express.Router()
const Billing= require('../models/billing')

// I.N.D.U.C.E.S (RESTful Routes)

// ** Index - GET /fruits - get all all the fruits and send back a page
// ** New - GET /fruits/new - send a form to create a new fruit
// ** Delete - Delete /fruits/:fruitId - delete some fruits based on the param passed
// ** Update - Put /fruits/:fruitId  - update some fruits based on the param passed and req.body
// ** Create - Post /fruits - take data from the fruits/new form and add to the data
// ** Edit - GET /fruits/:fruitId/edit - edit a specific fruit
// ** Show - GET /fruits/:fruitId - show one specific fruit

// Extra Routes 
// GET /fruits/:fruitId/confirm_delete -> Show a confirmation for deleting an item
// 
module.exports = router