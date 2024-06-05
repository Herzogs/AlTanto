import {Router} from 'express'
import * as routesController from '../controllers/road.controller'

const router = Router()

router.get('/', routesController.getAllRoads)
router.get('/:id', routesController.getRouteById)
router.post('/', routesController.createRoad)
router.get('/user/:id', routesController.getRoadsByUserId)

export default router