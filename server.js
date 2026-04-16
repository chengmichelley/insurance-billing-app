require('dotenv').config()
const express = require('express')
const app = express()
const Port = process.env.PORT || 3000
const methodOverride = require('method-override')
const morgan = require('morgan')
const billingController = require('./controllers/billing.controller')

require('./db/connection')

//app.use(express.urlenncoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.get('/*slug', (req,res)=> {
  res.render('error.ejs', {message: "Page Not Found"})
})

app.use(billingController)

app.listen(Port, ()=> console.log('Listening on port', Port))