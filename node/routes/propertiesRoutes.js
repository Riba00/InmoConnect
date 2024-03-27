import express from "express"
import { body } from 'express-validator'
import { admin, create, store } from '../controllers/propertyController.js'

const router = express.Router()

router.get('/my-properties', admin)
router.get('/properties/create', create)
router.post('/properties/create', 
    body('title').notEmpty().withMessage('Title is required'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ max:200 }).withMessage('Description is too long'),
    body('category').isNumeric().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price is required'),
    body('rooms').isNumeric().withMessage('Rooms is required'),
    body('wcs').isNumeric().withMessage('WCs is required'),
    body('parkings').isNumeric().withMessage('Parking is required'),
    body('lat').notEmpty().withMessage('Property location is required'),
    store
)

export default router