import { ModelCtor, QueryTypes } from "sequelize";
import Zone from "./entities/Zone";
import { Location } from "./entities/Location";
import { IZoneDto } from "../models/zone.interface";
import { IZoneRepository } from "./interface/zone.repository.interface";

class ZoneRepository implements IZoneRepository<IZoneDto, object>{

    private zoneModel: ModelCtor<Zone>;

    constructor({ Zone }: { Zone: ModelCtor<Zone> }) {
        this.zoneModel = Zone;
    }

    async create(newZone: IZoneDto): Promise<IZoneDto | null> {
        const locationSearched = await Location.findOrCreate({
            where: { latitude: newZone.location.lat, longitude: newZone.location.lon },
        })

        const location = locationSearched[0].get({ plain: true });
        const zone = await this.zoneModel.create({
            name: newZone.name,
            radio: newZone.rad,
            LocationId: location.id,
            userId: newZone.userId

        })
        if (!zone) {
            return null
        }
        const zonePlain = zone.get({ plain: true });
        const aux: IZoneDto = {
            id: zonePlain.id,
            name: zonePlain.name,
            location: {
                lat: location.latitude,
                lon: location.longitude
            },
            rad: zonePlain.radio,
            userId: zonePlain.userId
        }
        return aux
    }

    async getAll(): Promise<IZoneDto[]> {
        try{
            const listOfZones = await this.zoneModel.findAll({
                include: [
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['LocationId'] }
            });
            if (!listOfZones) {
                return [];
            }
            const aux = listOfZones.map((zone) => zone.get({ plain: true }));
            const aux2: IZoneDto[] = []
            aux.forEach((zone) => {
                aux2.push({
                    id: zone.id,
                    name: zone.name,
                    location: {
                        lat: zone.Location.latitude,
                        lon: zone.Location.longitude 
                    },
                    rad: zone.radio,
                    userId: zone.userId
                })
            })
            
            return aux2
        }catch(e){
            console.log(e)
            return []
        }
        
    }

    async getAllByUserId(userId: number): Promise<IZoneDto[]> {
        const listOfZone = await this.zoneModel.findAll({
            where: { userId: +userId },
            include: [
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['LocationId'] }
        });
        if (!listOfZone) {
            return []
        }
        const aux = listOfZone.map((zone) => zone.get({ plain: true }));
        const listOfZones: IZoneDto[] = []
        aux.forEach((zone) => {
            listOfZones.push({
                id: zone.id,
                name: zone.name,
                location: {
                    lat: zone.Location.latitude,
                    lon: zone.Location.longitude
                },
                rad: zone.radio,
                userId: zone.userId
            })
        })
        return listOfZones
    }

    async getById(zoneId: number): Promise<IZoneDto | null> {
        const zone = await this.zoneModel.findByPk(zoneId, {
            include: [
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['LocationId'] }
        });
        if (!zone) {
            return null
        }
        const zonePlain = zone.get({ plain: true });
        return {
            id: zonePlain.id,
            name: zonePlain.name,
            location: {
                lat: zonePlain.Location.latitude,
                lon: zonePlain.Location.longitude
            },
            rad: zonePlain.radio,
            userId: zonePlain.userId
        };
    }

    async deleteById(zoneId: number): Promise<boolean> {
        const zone = await this.zoneModel.findByPk(zoneId);
        if (!zone) {
            return false
        }
        await zone.destroy();
        return true
    }

    async getReports(zone: IZoneDto): Promise<NonNullable<object[]> | null> {
        
        const { location, rad } = zone;
        const reports = await Zone.sequelize?.query(
            `SELECT Report.id, Report.content, Report.images, Report.positiveScore, Report.negativeScore, Report.createAt, Report.categoryId,
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
                    lat: parseFloat(location.lat),
                    lon: parseFloat(location.lon),
                    radius: parseFloat(rad.toString())
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