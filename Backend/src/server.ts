import express from 'express'
import router from './routes/index.routes'
import cors from 'cors'

const server = express()

server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}))
server.use('/api',router)

server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

export default server