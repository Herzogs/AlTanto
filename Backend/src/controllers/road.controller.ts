import { Request, Response, NextFunction } from 'express';
import { IRoadDto } from 'models/road.interfaces';
import * as validationRouts from '../validator/road.validatos';
import { IRoadService } from '../services/interfaces/road.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class RoadController {
    private roadService: IRoadService<IRoadDto>;

    constructor({ roadService }: { roadService: IRoadService<IRoadDto> }) {
        this.roadService = roadService;
    }

    async getAllRoads(_req: Request, res: Response, next: NextFunction) {
        try {
            const roads = await this.roadService.getAllRoads();
            res.status(STATUS_CODE.SUCCESS).json(roads);
        } catch (error) {
            next({message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR});
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
            return next({ message: listOffErrors, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const road = await this.roadService.getRouteById(+req.params.id);
            if (!road) {
                return next({ message: 'Road not found', statusCode: STATUS_CODE.NOT_FOUND });
            }
            res.status(STATUS_CODE.SUCCESS).json(road);
        } catch (error) {
            next({message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR});
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
            return next({ message: listOffErrors, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const roads = await this.roadService.getRoadsByUserId(req.params.id);
            res.status(STATUS_CODE.SUCCESS).json(roads);
        } catch (error) {
            next({message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR});
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
            return next({ message: listOffErrors, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const road = await this.roadService.createRoad(req.body as IRoadDto);
            res.status(STATUS_CODE.CREATED).json(road);
        } catch (error) {
            next({message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR});
        }

    }

}
export default RoadController;