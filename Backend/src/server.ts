import express from 'express'
import router from './routes/index.routes'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler.middleware'

const server = express()

server.use(express.json())
server.use("/static",express.static('public'))
server.use(express.urlencoded({extended: true}))
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}))
server.use('/api',router)
server.use(errorHandler)
const app = server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

export {server, app}