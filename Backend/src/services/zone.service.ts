import Zone from '../models/Zone';
import {IZone, IZoneRequest} from "../interfaces/zone.interface";
import * as zoneRepository from '../repository/zone.repository';
import transformData from '../utilities/transformData.utilities';
import { ZoneNotCreatedException, ZoneNotFoundException } from '../exceptions/zone.exceptions';


const createZone = async (newZone: IZoneRequest): Promise<IZone> => {
    const zoneCreated = await zoneRepository.default.create(newZone);
    if (!zoneCreated) throw new ZoneNotCreatedException("Zone not created");
    return zoneCreated;
}

const getAllZone = async (): Promise<Zone[]> => {
    const listOfZones = await zoneRepository.default.getAllZone();
    if (!listOfZones) throw new ZoneNotFoundException("Zones not found");
    return listOfZones.map(transformData);
}

const getZoneById = async (zoneId: number) => {
    const zoneSearched = await zoneRepository.default.getZoneById(zoneId);
    if (!zoneSearched) throw new ZoneNotFoundException("Zone not found");
    return transformData(zoneSearched);
}

export {createZone, getAllZone, getZoneById}