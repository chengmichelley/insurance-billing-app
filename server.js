require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const methodOverride = require('method-override')
const morgan = require('morgan')
const billingController = require('./controllers/billing.controller')

require('./db/connection')

app.use(express.urlenncoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())

app.use("/billing", billingController)

app.set('view engine', 'ejs')

app.get('*', (req,res)=> {
  res.render('error.ejs', {message: "Page Not Found"})
})

app.listen(PORT, ()=> console.log(`Listening on ${PORT}`, PORT))