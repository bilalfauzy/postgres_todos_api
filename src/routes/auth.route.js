const router = require('express').Router()
const validInfo = require('../middleware/validInfo')
const authorize = require('../middleware/authorize')
const { 
    registerHandler, loginHandler, verifyHandler 
} = require('../controller/auth.controller')


router.post('/register', validInfo, registerHandler)
router.post('/login', validInfo, loginHandler)
router.post('/verify', authorize, verifyHandler)

module.exports = router