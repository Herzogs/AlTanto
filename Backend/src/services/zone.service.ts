import Zone from '../models/Zone';
import {Location, findEntitiesWithinRadius} from '../models/Location';
import {IZoneRequest} from "../interfaces/zone.interface";
import Report from "../models/Report";


async function createZone(newZone: IZoneRequest): Promise<Zone> {
    const location = await Location.create({latitude: newZone.latitude, longitude: newZone.longitude});
    const locationCreated = location.get({plain: true});
    const zone = await Zone.create({
        name: newZone.name,
        LocationId: locationCreated.id
    })
    console.log(zone.get({plain: true}))
    if (!zone) {
        throw new Error("Zone could not be created");
    }
    return zone;
}

async function getAllZone(): Promise<Zone[]> {
    return await Zone.findAll({
        include: [
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
    });
}

async function getZoneById(zoneId: number) {
    const zone = await Zone.findByPk(zoneId, {
        include: [
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
    });
    if (!zone) {
        throw new Error("Zone not found");
    }
    const zoneSearched = await zone.get({plain: true});
    //Todo: arreglar la devolucion con otros datos
     const  reportsSearched= await findEntitiesWithinRadius(Report, zoneSearched.Location, 500000);
return{zone:zoneSearched, reportsSearched:reportsSearched};
}

export {createZone, getAllZone, getZoneById}