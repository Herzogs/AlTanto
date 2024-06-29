import { Router } from 'express'
import RoadController from '../controllers/road.controller'
import { auth } from '../middlewares/auth.middlewares'
import { makeInvoker } from 'awilix-express'

const roadRouter = Router()
const api = makeInvoker(RoadController)
roadRouter.get('/', auth, api('getAllRoads'))
roadRouter.get('/:id', auth, api('getRouteById'))
roadRouter.post('/', auth, api('createRoad'))
roadRouter.get('/user/:id', auth, api('getRoadsByUserId'))


export default roadRouter