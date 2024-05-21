import {Request, Response} from "express";
import * as zoneService from '../services/zone.service';
import {IZoneRequest} from "../interfaces/zone.interface";
import  * as zoneValidator from "../validator/zone.validator";

const getAllZones = async (_req: Request, res: Response) => {
    try {
        const zones = await zoneService.getAllZone();
        return res.json(zones);
    } catch (error) {
        return res.status(500).json({error: (error as Error).message});
    }
}
const createZone = async ( req: Request, res: Response): Promise<Response> => {
    const validData = await zoneValidator.createZone.parseAsync(req.body) as IZoneRequest;
    const zone = zoneService.createZone(validData);
    return res.json(zone);
}


const getZoneById= async (req: Request, res: Response):Promise<Response> => {
    console.log(req.params.zoneId);
    try {
        const zoneId = parseInt(req.params.zoneId);
        const zone = await zoneService.getZoneById(zoneId);
        console.log(zone);
        return res.status(200).json(zone);

    }catch (error) {
            return res.status(400).json({ error: (error as Error).message });
        }
}

export {getAllZones, createZone, getZoneById}