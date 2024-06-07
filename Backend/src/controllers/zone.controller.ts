import {NextFunction, Response} from "express";
import * as zoneService from '../services/zone.service';
import {IZoneRequest} from "../interfaces/zone.interface";
import * as zoneValidator from "../validator/zone.validator";
import {ZoneNotCreatedException, ZoneNotFoundException} from "../exceptions/zone.exceptions";
import {AuthenticatedRequest} from "../middlewares/auth.middlewares";

const getAllZones = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userEmail= req.usuarioPP;
        if(!userEmail)return null;
        const zones = await zoneService.getAllZone(userEmail);
        return res.json(zones);
    } catch (error) {
        if (error instanceof ZoneNotFoundException) {
            return next({message: error.message, statusCode: error.statusCode});
        }
        return next((error as Error).message);
    }
}
const createZone = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const validData = await zoneValidator.createZoneValidator.safeParseAsync(req.body);
    if (!validData.success) {
        return next({message: validData.error.errors[0].message, statusCode: 400});
    }

    const newZone: IZoneRequest = {
        ...validData.data,
        email: req.usuarioPP as string,
    }
    try {
        const zone = await zoneService.createZone(newZone);
        return res.status(201).json(zone);
    } catch (error) {
        if (error instanceof ZoneNotCreatedException) {
            return next({message: error.message, statusCode: error.statusCode});
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
}

const getZoneById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const validData = await zoneValidator.getZoneByIdValidator.safeParseAsync(req.params);
    if (!validData.success) {
        return next({message: validData.error.errors[0].message, statusCode: 400});
    }
    const useUse = req.usuarioPP;
    if(!useUse)return null;
    try {
        const {id} = validData.data as { id: string };
        const zone = await zoneService.getZoneById(+id, useUse);
        console.log(zone);
        return res.status(200).json(zone);

    } catch (error) {
        if (error instanceof ZoneNotFoundException) {
            return next({message: error.message, statusCode: error.statusCode});
        }
        // Para otros tipos de errores, pasar al siguiente middleware de error
        return next((error as Error).message);
    }
}

export {getAllZones, createZone, getZoneById}