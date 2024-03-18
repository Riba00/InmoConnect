import express from 'express'
import { loginForm, registerForm, register, confirmEmail, resetPassowrdForm, resetPassword, checkToken, newPassword } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)

router.get('/register', registerForm)
router.post('/register', register)

router.get('/emailConfirmation/:token',confirmEmail)

router.get('/reset-password', resetPassowrdForm)
router.post('/reset-password', resetPassword)

// Store new password
router.get('/forgot-password/:token', checkToken)
router.post('/forgot-password/:token', newPassword)

export default router