import express from 'express'
import { loginForm, registerForm, register, confirmEmail, resetPassowrdForm } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)

router.get('/register', registerForm)
router.post('/register', register)

router.get('/emailConfirmation/:token',confirmEmail)

router.get('/reset-password', resetPassowrdForm)

export default router