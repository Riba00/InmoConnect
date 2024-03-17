import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes.js'
import db from './config/db.js'


// Create app
const app = express()

// Enable data reading on forms
app.use( express.urlencoded({extended: true}))

// Enable Cookie Parser
app.use( cookieParser() )

// Enable CSRF
app.use( csrf({ cookie: true }) )

// DB Connection
try {
    await db.authenticate();
    db.sync()
    console.log('Connection correct')
} catch (error) {
    console.log(error);
}

// Habilite Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Public Folder
app.use( express.static('public'))

// Routing
app.use('/auth', userRouter)



// Define port and run project
const port = process.env.APP_PORT || 3000
app.listen(port, ()=> {
    console.log(`Server running on ${port}`);
})