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
    const newZoneRequest = req.body;
    const newZone: IZoneRequest = {
        name: newZoneRequest.name,
        latitude: newZoneRequest.latitude,
        longitude: newZoneRequest.longitude
    };
    const zone = zoneService.createZone(newZone);
    return res.json(zone);
}
const getZoneById= async (req: Request, res: Response):Promise<Response> => {

    try {
        const zoneId = parseInt(req.params.zoneId);
        const zone = await zoneService.getZoneById(zoneId);
        return res.status(200).json(zone);

    }catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
}

export {getAllZones, createZone, getZoneById}