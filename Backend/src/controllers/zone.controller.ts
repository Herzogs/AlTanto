import { Request, Response, NextFunction } from "express";
import { IZoneDto, IZoneReport } from "../interfaces/zone.interface";
import { IZoneService } from "../services/interfaces/zone.service.interface";
import * as zoneValidator from "../validator/zone.validator";

class ZoneController {
    private zoneService: IZoneService<IZoneDto, IZoneReport>;

    constructor({ zoneService }: { zoneService: IZoneService<IZoneDto, IZoneReport> }) {
        this.zoneService = zoneService;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        
        const validData = await zoneValidator.createZoneValidator.safeParseAsync(req.body);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
        }

        try {
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
            return res.status(201).json(zone);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

    async getAll (_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const zones = await this.zoneService.getAll();
            return res.json(zones);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validData = await zoneValidator.getZoneByIdValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { id } = validData.data as { id: string };
            const zone = await this.zoneService.getById(+id);
            return res.status(200).json(zone);

        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

    async getNotification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log("getNotification")
        
        const validData = await zoneValidator.getNotificationValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { userId } = validData.data as { userId: string };
            const result = await this.zoneService.getNotification(+userId);
            return res.status(200).json(result);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

    async getAllByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log("getAllByUserId")
        console.log("req.params")

        console.log(req)
        const validData = await zoneValidator.getAllByUserIdValidator.safeParseAsync(req.params);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
        }
        console.log(validData.data)
        try {
            const { id } = validData.data as { id: string };
            const zones = await this.zoneService.getAllByUserId(+id);
            return res.json(zones);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

    async getFilteredReports(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log("getFilteredReports")
        console.log(req.params)
        const validData = await zoneValidator.getFilteredReportsValidator.safeParseAsync(req.query);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
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
            return next({ message: (error as Error).message, statusCode: 404 });
        }
    }

}

export default ZoneController;