import { Request, Response, NextFunction } from "express";
import { IZoneDto, IZoneReport } from "../models/zone.interface";
import { IZoneService } from "../services/interfaces/zone.service.interface";
import * as zoneValidator from "../validator/zone.validator";
import { STATUS_CODE } from "../utilities/statusCode.utilities";

class ZoneController {
    private zoneService: IZoneService<IZoneDto, IZoneReport>;

    constructor({ zoneService }: { zoneService: IZoneService<IZoneDto, IZoneReport> }) {
        this.zoneService = zoneService;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log(req.body)
        const validData = await zoneValidator.createZoneValidator.safeParseAsync(req.body);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            console.log(validData.data)
            const miZona: IZoneDto = {
                name: validData.data.name,
                location: {
                    lat: validData.data.latitude,
                    lon: validData.data.longitude
                },
                rad: validData.data.radio,
                userId: validData.data.userId
            }
            
            const zone = await this.zoneService.create(miZona);
            return res.status(STATUS_CODE.CREATED).json(zone);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getAll(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const zones = await this.zoneService.getAll();
            return res.status(STATUS_CODE.SUCCESS).json(zones);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validData = await zoneValidator.getZoneByIdValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { id } = validData.data as { id: string };
            const zone = await this.zoneService.getById(+id);
            return res.status(STATUS_CODE.SUCCESS).json(zone);

        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getNotification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        console.log(req.params)
        const validData = await zoneValidator.getNotificationValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { userId } = validData.data as { userId: string };
            const result = await this.zoneService.getNotification(+userId);
            return res.status(STATUS_CODE.SUCCESS).json(result);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getAllByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {



        const validData = await zoneValidator.getAllByUserIdValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        console.log(validData.data)
        try {
            const { id } = validData.data as { id: string };
            const zones = await this.zoneService.getAllByUserId(+id);
            return res.json(zones);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getFilteredReports(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const validData = await zoneValidator.getFilteredReportsValidator.safeParseAsync(req.query);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { lat, lon, rad } = validData.data as { lat: string, lon: string, rad: string };
            const miZona: IZoneDto = {
                name: 'zona',
                location: {
                    lat: lat,
                    lon: lon
                },
                rad: +rad,
                userId: 1
            }
            const result = await this.zoneService.getFilteredReports(miZona);
            return res.status(200).json(result);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

}

export default ZoneController;