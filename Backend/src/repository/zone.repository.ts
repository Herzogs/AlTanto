import Zone from './models/Zone';
import {Location} from './models/Location';
import {IZone, IZoneRequest} from '../interfaces/zone.interface';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';


class ZoneRepository {
    static async create(newZone: IZoneRequest): Promise<IZone> {
        const locationSearched = await Location.findOrCreate({
            where: {latitude: newZone.latitude, longitude: newZone.longitude},
        })

        const location = locationSearched[0].get({plain: true});
        const zone = await Zone.create({
            name: newZone.name,
            radio: newZone.radio,
            LocationId: location.id,
            userId: newZone.userId

        })
        if (!zone) {
            throw new ZoneNotCreatedException("Zone not created");
        }
        return zone.get({plain: true});
    }

    static async getAllZone(): Promise<IZone[]> {
        const listOfZones = await Zone.findAll({
            include: [
                {model: Location, attributes: ['latitude', 'longitude']}
            ],
            attributes: {exclude: ['LocationId']}
        });
        if (!listOfZones) {
            throw new ZoneNotFoundException("Zones not found");
        }
        return listOfZones.map((zone) => zone.get({plain: true}));
    }

    static async getAllZoneByUserId(userId: number): Promise<IZone[]> {
        const listOfZones = await Zone.findAll({
            where: {userId: +userId},
            include: [
                {model: Location, attributes: ['latitude', 'longitude']}
            ],
            attributes: {exclude: ['LocationId']}
        });
        if (!listOfZones) {
            throw new ZoneNotFoundException("Zones not found");
        }
        return listOfZones.map((zone) => zone.get({plain: true}));
    }

    static async getZoneById(zoneId: number): Promise<IZone> {
        const zone = await Zone.findByPk(zoneId, {
            include: [
                {model: Location, attributes: ['latitude', 'longitude']}
            ],
            attributes: {exclude: ['LocationId']}
        });
        if (!zone) {
            throw new ZoneNotFoundException("Zone not found");
        }
        const zoneSearched = await zone.get({plain: true});
        return zoneSearched as IZone;
    }

    static async getByLatLongRadius(zoneWithRadius: IZone): Promise<object[] | null> {
        const { lat, lon, rad } = zoneWithRadius;
        const reports = await Report.sequelize?.query(
            `SELECT Report.id, Report.content, Report.images, Report.positiveScore, Report.negativeScore, Report.categoryId,
                Location.latitude, Location.longitude, 
                Category.name AS categoryName,
                (6371000 * acos(
                    least(1, cos(radians(:lat)) * cos(radians(Location.latitude)) * cos(radians(Location.longitude) - radians(:lon)) +
                    sin(radians(:lat)) * sin(radians(Location.latitude)))
                )) AS distancia
            FROM Location
            JOIN Report ON Location.id = Report.LocationId
            JOIN Category ON Report.CategoryId = Category.id
            WHERE Report.enabled = true AND Report.groupId IS NULL
            HAVING distancia <= :radius
            ORDER BY distancia;`,
            {
                replacements: {
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    radius: parseFloat(rad)
                },
                type: QueryTypes.SELECT
            }
        );
        if (!reports) {
            return null;
        }
        return reports;
    }
}

export default ZoneRepository;