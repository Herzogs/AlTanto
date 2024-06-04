import Zone from '../models/Zone';
import {IZone, IZoneRequest} from "../interfaces/zone.interface";
import * as zoneRepository from '../repository/zone.repository';
import transformData from '../utilities/transformData.utilities';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';
import userRepository from "../repository/user.repository";
import {UserNotCreatedException} from "../exceptions/users.exceptions";


const createZone = async (newZone: IZoneRequest): Promise<IZone> => {
    const userSearched = await userRepository.getUserByEmail(newZone.email);
    console.log("servicio zone 12");
    const newUser = userSearched?.get({plain: true})
    if (!userSearched) throw new UserNotCreatedException("User not found", 400);
    console.log("servicio zone 15", newUser.id, " userSearched");
    const zoneCreated = await zoneRepository.default.create(newZone, newUser.id);
    console.log("servicio zone 17");
    if (!zoneCreated) throw new ZoneNotCreatedException("Zone not created");
    return zoneCreated;
}

const getAllZone = async (): Promise<Zone[]> => {
    console.log("servicio zone 16")
    const listOfZones = await zoneRepository.default.getAllZone();
    if (!listOfZones) throw new ZoneNotFoundException("Zones not found");

    console.log("servicio zone 20")
    return listOfZones.map(transformData);
}

const getZoneById = async (zoneId: number) => {
    const zoneSearched = await zoneRepository.default.getZoneById(zoneId);
    if (!zoneSearched) throw new ZoneNotFoundException("Zone not found");
    return transformData(zoneSearched);
}

export {createZone, getAllZone, getZoneById}