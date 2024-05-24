import Zone from '../models/Zone';
import { Location } from '../models/Location';
import { IZone, IZoneRequest } from '../interfaces/zone.interface';

class ZoneRepository {
    static async create(newZone: IZoneRequest): Promise<IZone> {
        const locationSearched = await Location.findOrCreate({
            where: { latitude: newZone.latitude, longitude: newZone.longitude },
        })
        const location = locationSearched[0].get({ plain: true });
        const zone = await Zone.create({
            name: newZone.name,
            LocationId: location.id
        })
        if (!zone) {
            throw new Error("Zone not created");
        }
        return zone.get({ plain: true });
    }

    static async getAllZone(): Promise<IZone[]> {
        const listOfZones = await Zone.findAll({
            include: [
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: [ 'LocationId'] }
        });
        if (!listOfZones) {
            throw new Error("Zones not found");
        }
        return listOfZones.map((zone) => zone.get({ plain: true }));
    }

    static async getZoneById(zoneId: number): Promise<IZone> {
        const zone = await Zone.findByPk(zoneId, {
            include: [
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['LocationId'] }
        });
        if (!zone) {
            throw new Error("Zone not found");
        }
        const zoneSearched = await zone.get({ plain: true });
        return zoneSearched as IZone;
    }
}

export default ZoneRepository;