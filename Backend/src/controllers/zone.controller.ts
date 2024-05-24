import { NextFunction, Request, Response } from "express";
import * as zoneService from '../services/zone.service';
import { IZoneRequest } from "../interfaces/zone.interface";
import * as zoneValidator from "../validator/zone.validator";
import { ZoneNotFoundException, ZoneNotCreatedException } from "../exceptions/zone.exceptions";

const getAllZones = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const zones = await zoneService.getAllZone();
        return res.json(zones);
    } catch (error) {
        if (error instanceof ZoneNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
}
const createZone = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validData = await zoneValidator.createZoneValidator.safeParseAsync(req.body);
    if (!validData.success) {
        return next({ message: validData.error.errors[0].message, statusCode: 400 });
    }
    try {
        const zone = await zoneService.createZone(validData.data as IZoneRequest);
        return res.status(201).json(zone);
    } catch (error) {
        if (error instanceof ZoneNotCreatedException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
}

const getZoneById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validData = await zoneValidator.getZoneByIdValidator.safeParseAsync(req.params);
    if (!validData.success) {
        return next({ message: validData.error.errors[0].message, statusCode: 400 });
    }
    try {
        const { id } = validData.data as { id: string };
        const zone = await zoneService.getZoneById(+id);
        console.log(zone);
        return res.status(200).json(zone);

    } catch (error) {
        if (error instanceof ZoneNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
}

export { getAllZones, createZone, getZoneById }