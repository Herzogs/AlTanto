import {Router} from 'express'
import RoadController from '../controllers/road.controller'
//import { auth } from '../middlewares/auth.middlewares'
import { makeInvoker } from 'awilix-express'

const roadRouter = Router()
const api = makeInvoker(RoadController)
roadRouter.get('/', api('getAllRoads'))
roadRouter.get('/:id', api('getRouteById'))
roadRouter.post('/', api('createRoad'))
roadRouter.get('/user/:id', api('getRoadsByUserId'))

export default roadRouter