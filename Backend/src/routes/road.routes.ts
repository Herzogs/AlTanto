import {Router} from 'express'
import * as routesController from '../controllers/road.controller'
import { auth } from '../middlewares/auth.middlewares'

const roadRouter = Router()

roadRouter.get('/', auth, routesController.getAllRoads)
roadRouter.get('/:id', auth, routesController.getRouteById)
roadRouter.post('/', auth, routesController.createRoad)
roadRouter.get('/user/:id', auth, routesController.getRoadsByUserId)

export default roadRouter