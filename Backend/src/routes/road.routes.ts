import {Router} from 'express'
import routesController from '../controllers/road.controller'
import { auth } from '../middlewares/auth.middlewares'

const router = Router()

router.get('/', auth, routesController.getAllRoads)
router.get('/:id', auth, routesController.getRouteById)
router.post('/', auth, routesController.createRoad)
router.get('/user/:id', auth, routesController.getRoadsByUserId)

export default router