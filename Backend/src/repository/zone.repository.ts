import Zone from '../models/Zone';
import {Location} from '../models/Location';
import {IZone, IZoneRequest} from '../interfaces/zone.interface';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';

class ZoneRepository {
    static async create(newZone: IZoneRequest, userId: number): Promise<any> {
        const locationSearched = await Location.findOrCreate({
            where: { latitude: newZone.latitude, longitude: newZone.longitude },
        })
        console.log("repos zone 11");
        try {
            const location = locationSearched[0].get({ plain: true });
            const zoneSearched= await Zone.findOne({
                where:{UserId:userId, name:newZone.name},
            })
            if (zoneSearched){
                throw new ZoneNotCreatedException("repeated zone name");
            }
            const zone = await Zone.create({
                name: newZone.name,
                LocationId: location.id,
                UserId:userId,
            })
            console.log("repos zone 19");
            if (!zone) {
                console.log("repos zone 21");
                throw new ZoneNotCreatedException("Zone not created");
            }
            return zone.get({ plain: true });
        }catch (eror){
            console.log((eror as Error).message);

        }


    }

    static async getAllZone(): Promise<IZone[]> {
        const listOfZones = await Zone.findAll({
            include: [
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: [ 'LocationId'] }
        });
        if (!listOfZones) {
            throw new ZoneNotFoundException("Zones not found");
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
            throw new ZoneNotFoundException("Zone not found");
        }
        const zoneSearched = await zone.get({ plain: true });
        return zoneSearched as IZone;
    }
}

export default ZoneRepository;