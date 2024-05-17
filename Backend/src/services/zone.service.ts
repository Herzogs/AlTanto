import Zone from '../models/Zone';
import Location from '../models/Location';
import {IZoneRequest} from "../interfaces/zone.interface";


async function createZone(newZone: IZoneRequest): Promise<Zone> {
    const location = await Location.create({latitude: newZone.latitude, longitude: newZone.longitude});
    const locationCreated = location.get({plain: true});
    console.log(locationCreated.latitude + "Esto es mkio")
    const zone = await Zone.create({
        name: newZone.name,
        LocationId: locationCreated.id
    })
    console.log(zone.get({plain: true}))
    if (!zone) {
        throw new Error("No se pudo crear la zona");
    }
    return zone;
}
async function getAllZone():Promise<Zone[]> {
    return await Zone.findAll({
        include: [
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
        });
}

export {createZone, getAllZone}