const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const authRequired = require('../middleware/authRequired')
const isAdmin = require('../middleware/isAdmin')

router.get('/sign-up', authRequired, isAdmin, (req, res)=> {
  res.render('auth/sign-up.ejs', { err: ''})
})

router.post('/sign-up', authRequired, isAdmin, async (req, res)=> {
  try {
    const { username, password, confirmPassword } = req.body

    const foundUser = await User.findOne({ username });

    if(foundUser) {
      throw new Error(`User with this username ${username} already existed.`)
    }

    if(password !== confirmPassword){ throw new Error('Password and password confirm do not match!')}

    const hashedPassword = bcrypt.hashSync(password, 8);

    await User.create({
      username,
      hashedPassword,
      role: 'user'
    })

    res.redirect(`/patients/search?message=Staff member ${ username } created successfully!`)
  
  } catch (error) {
    res.render('auth/sign-up', { err: error.message })
  }
})

router.get('/sign-in', (req, res)=> {
  res.render('auth/sign-in', { err: ''})
})

router.post('/sign-in', async (req, res)=> {
  const {username, password} = req.body

  try{
    const foundUser = await User.findOne({ username }).select(
      "+hashedPassword",
    );
    
    if(!foundUser){
      throw new Error(`Invalid Username.`)
    }

    const isValidPassword = bcrypt.compareSync(password, foundUser.hashedPassword)

    if(!isValidPassword){
      throw new Error('Invalid Password.')
    }

    req.session.user = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role
    }

    req.session.save(()=> {
      const redirectTo = req.session.returnTo || '/patients/search';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    })
  } catch (error) {
    res.render('auth/sign-in', { err: error.message })
  }
})

router.get('/sign-out', (req, res)=> {
  req.session.destroy(()=> {
    res.redirect('/auth/sign-in')
  })
})

module.exports = router
