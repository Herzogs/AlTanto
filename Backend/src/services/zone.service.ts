import Zone from '../models/Zone';
import Location from '../models/Location';
import {IZoneRequest} from "../interfaces/zone.interface";
import Report from "../models/Report";
import { Op } from 'sequelize';


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
    const zone =await Zone.findByPk(zoneId,{
        include:[
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
    });
    if (!zone) {
        throw new Error("Zone not found");
    }
    const metersToDegrees = 1 / 111120;
    const radiusInMeters = 50;
    const radius = radiusInMeters * metersToDegrees;



    const zoneSearched= await zone.get({plain: true});
    const zoneLatitude = parseFloat(zoneSearched.Location.latitude);
    const zoneLongitude = parseFloat(zoneSearched.Location.longitude);
    const minLatitude = zoneLatitude - (radius / 111.12);
    const maxLatitude = zoneLatitude + (radius / 111.12);
    const minLongitude = zoneLongitude - (radius / (111.12 * Math.cos(zoneLatitude * (Math.PI / 180))));
    const maxLongitude = zoneLongitude + (radius / (111.12 * Math.cos(zoneLatitude * (Math.PI / 180))));
    const reports = await Report.findAll({
        include: [{
            model: Location,
            attributes: [],
            where: {
                latitude: { [Op.between]: [minLatitude, maxLatitude] },
                longitude: { [Op.between]: [minLongitude, maxLongitude] }
            }
        }]
    });
    return  reports;
}


export {createZone, getAllZone,getZoneById}