import Zone from '../models/Zone';
import {IZone, IZoneRequest} from "../interfaces/zone.interface";
import * as zoneRepository from '../repository/zone.repository';
import transformData from '../utilities/transformData.utilities';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';
import userRepository from "../repository/user.repository";
import {UserNotCreatedException} from "../exceptions/users.exceptions";


const createZone = async (newZone: IZoneRequest): Promise<IZone> => {
    const userSearched = await userRepository.getUserByEmail(newZone.email);
    const newUser = userSearched?.get({plain: true})
    if (!userSearched) throw new UserNotCreatedException("User not found", 400);
    const zoneCreated = await zoneRepository.default.create(newZone, newUser.id);
    if (!zoneCreated) throw new ZoneNotCreatedException("Zone not created");
    return zoneCreated;
}

const getAllZone = async (userEmail: string): Promise<Zone[]> => {
    const userSearched = await userRepository.getUserByEmail(userEmail);
    const newUser = userSearched?.get({plain: true})
    const listOfZones = await zoneRepository.default.getAllZone(newUser.id);
    if (!listOfZones) throw new ZoneNotFoundException("Zones not found");

    return listOfZones.map(transformData);
}

const getZoneById = async (zoneId: number, userEmail: string):Promise<IZone|null> => {
    const userSearched = await userRepository.getUserByEmail(userEmail);
    const newUser = userSearched?.get({plain: true})
    const zoneSearched = await zoneRepository.default.getZoneById(zoneId, newUser.id);
    if (!zoneSearched) throw new ZoneNotFoundException("Zone not found");
    return transformData(zoneSearched);
}

export {createZone, getAllZone, getZoneById}