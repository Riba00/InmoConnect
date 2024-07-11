import express from "express"
import { init, category, notFound, searcher } from "../controllers/appController.js"


const router = express.Router()

router.get('/', init)

router.get('/categories/:id', category)

router.get('/404', notFound)

router.post('/searcher', searcher)

export default router







