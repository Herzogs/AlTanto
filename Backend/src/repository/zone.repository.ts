import Zone from '../models/Zone';
import {Location} from '../models/Location';
import {IZone, IZoneRequest} from '../interfaces/zone.interface';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';

class ZoneRepository {
    static async create(newZone: IZoneRequest, userId: number): Promise<any> {
        const locationSearched = await Location.findOrCreate({
            where: {latitude: newZone.latitude, longitude: newZone.longitude},
        })
        try {
            const location = locationSearched[0].get({plain: true});
            const zoneSearched = await Zone.findOne({
                where: {UserId: userId, name: newZone.name},
            })
            if (zoneSearched) {
                throw new ZoneNotCreatedException("repeated zone name");
            }
            const zone = await Zone.create({
                name: newZone.name,
                LocationId: location.id,
                UserId: userId,
            })
            console.log("repos zone 19");
            if (!zone) {
                console.log("repos zone 21");
                throw new ZoneNotCreatedException("Zone not created");
            }
            return zone.get({plain: true});
        } catch (eror) {
            console.log((eror as Error).message);

        }


    }

    static async getAllZone(userId: number): Promise<IZone[] | null> {
        try {
            const listOfZones = await Zone.findAll({
                where: {UserId: userId},
                include: [
                    {model: Location, attributes: ['latitude', 'longitude']}
                ],
                attributes: {exclude: ['LocationId']}
            });
            return listOfZones.map((zone) => zone.get({plain: true}));
        } catch (error) {
            console.log((error as Error).message);
            return null;
        }

    }

    static async getZoneById(zoneId: number, userId: number): Promise<IZone|null> {
        try {
            const zoneSearched = await Zone.findOne({
                where: { UserId: userId, id: zoneId },
                include: [
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['LocationId'] }
            });

            if (!zoneSearched) {
                throw new ZoneNotFoundException("Zone not found");
            }
          return  zoneSearched.get({ plain: true }) as IZone;

        } catch (error) {
            console.error((error as Error).message);
            return null;
        }
    }
}

export default ZoneRepository;