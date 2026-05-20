const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login) 

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Доступ разрешён',
    user: req.user
  })
})

module.exports = router