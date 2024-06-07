import { Request, Response, NextFunction } from 'express';
import * as roadServices from '../services/road.service'
import { IRoad } from 'interfaces/road.interfaces';
import * as validationRouts from '../validator/road.validatos';

const getAllRoads = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const roads = await roadServices.getAllRoads();
        res.status(200).json(roads);
    } catch (error) {
        next(( error as Error).message );
    }
}

const getRouteById = async (req: Request, res: Response, next: NextFunction) => {
    const validData = await validationRouts.getRoadByIdValidator.safeParseAsync(req.params);
    if (!validData.success) {
        const listOffErrors = validData.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')

            }
        });
        return next({ message: listOffErrors, statusCode: 400 });
    }
    try {
        const road = await roadServices.getRouteById(+req.params.id);
        res.status(200).json(road);
    } catch (error) {
        next(( error as Error).message );    }
}

const createRoad = async (req: Request, res: Response, next: NextFunction) => {
    
    const validData = await validationRouts.createRoadValidator.safeParseAsync(req.body);
    if (!validData.success) {
        const listOffErrors = validData.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')

            }
        });
        return next({ message: listOffErrors, statusCode: 400 });
    }
    console.log(req.body as IRoad);
    try {
        const road = await roadServices.createRoad(req.body as IRoad);
        res.status(201).json(road);
    } catch (error) {
        next(( error as Error).message );    }
}

const getRoadsByUserId = async (req: Request, res: Response, next: NextFunction) => {
   
    const validData = await validationRouts.getRoadsByUserIDlValidator.safeParseAsync(req.params);
    if (!validData.success) {
        const listOffErrors = validData.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')

            }
        });
        return next({ message: listOffErrors, statusCode: 400 });
    }
    try {
        const roads = await roadServices.getRoadsByUserId(req.params.id);
        res.status(200).json(roads);
    } catch (error) {
        next(( error as Error).message );
    }
}

export { getAllRoads, createRoad, getRouteById, getRoadsByUserId}