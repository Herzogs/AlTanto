import {Request, Response} from "express";
import * as zoneService from '../services/zone.service';
import {IZoneRequest} from "../interfaces/zone.interface";

const getAllZones = async (_req: Request, res: Response) => {
    try {
        const zones = await zoneService.getAllZone();
        return res.json(zones);
    } catch (error) {
        return res.status(500).json({error: (error as Error).message});
    }
}
const createZone = async ( req: Request, res: Response): Promise<Response> => {
    const newXoneReques = req.body;
    const newZone: IZoneRequest = {
        name: newXoneReques.name,
        latitude: newXoneReques.latitude,
        longitude: newXoneReques.longitude
    };
    const zone = zoneService.createZone(newZone);
    return res.json(zone);
}

export {getAllZones, createZone}