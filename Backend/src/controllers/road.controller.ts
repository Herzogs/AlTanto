import { Request, Response, NextFunction } from 'express';
import { IRoadDto } from 'interfaces/road.interfaces';
import * as validationRouts from '../validator/road.validatos';
import { IRoadService } from '../services/interfaces/road.service.interface';

class RoadController {
    private roadService: IRoadService<IRoadDto>;

    constructor({ roadService }: { roadService: IRoadService<IRoadDto> }) {
        this.roadService = roadService;
    }

    async getAllRoads(_req: Request, res: Response, next: NextFunction) {
        try {
            const roads = await this.roadService.getAllRoads();
            res.status(200).json(roads);
        } catch (error) {
            next((error as Error).message);
        }
    }

    async getRouteById(req: Request, res: Response, next: NextFunction) {
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
            const road = await this.roadService.getRouteById(+req.params.id);
            res.status(200).json(road);
        } catch (error) {
            next((error as Error).message);
        }
    }

    async getRoadsByUserId(req: Request, res: Response, next: NextFunction) {
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
            const roads = await this.roadService.getRoadsByUserId(req.params.id);
            res.status(200).json(roads);
        } catch (error) {
            next((error as Error).message);
        }
    }

    async createRoad(req: Request, res: Response, next: NextFunction) {
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
        try {
            const road = await this.roadService.createRoad(req.body as IRoadDto);
            res.status(201).json(road);
        } catch (error) {
            next((error as Error).message);
        }

    }

}
export default RoadController;