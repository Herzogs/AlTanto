import Road from "../models/Road";
import { Location } from "../models/Location";
import { IRoad } from "../interfaces/road.interfaces";

class RoadRepository {
    static async getAll(): Promise<Road[]> {
        const listOfRoad = await Road.findAll({
            include: [{ model: Location, attributes: ['latitude', 'longitude'] }],
            attributes: { exclude: ['LocationId'] }
        });
        if (!listOfRoad) {
            return [];
        }
        return listOfRoad.map((Road) => Road.get({ plain: true }));
    }

    static async getById(id: number): Promise<Road | null> {
        const roadSearched = await Road.findByPk(id);
        
        if (!roadSearched) {
          return null;
        }
        const road = roadSearched.get({ plain: true });

        const coordinatesOrigin = await Location.findByPk(road.origin);
        const coordinatesDestiny = await Location.findByPk(road.destination);
        road.origin = coordinatesOrigin;
        road.destination = coordinatesDestiny;
        
       return road;
      }

    static async create(road: IRoad): Promise<Road | null | unknown> {

    const locationSearchedOrigin = await Location.findOrCreate({
            where: { latitude: road.origin.lat, longitude: road.origin.lng }
        })

        const locationSearchedDestiny = await Location.findOrCreate({
            where: { latitude: road.destination.lat, longitude: road.destination.lng },
        })
        const locationOrigin = locationSearchedOrigin[0].get({ plain: true });
        const locationDestiny = locationSearchedDestiny[0].get({ plain: true });

        const roadCreated = await Road.create({
            name: road.name,
            addressOrigin: road.addressOrigin,
            addressDestiny: road.addressDestiny,
            origin: locationOrigin.id,
            destination: locationDestiny.id,
            distance: road.distance,
            duration: road.duration,
            user: road.user,
        });
        if (!roadCreated) return null
        return roadCreated.get({ plain: true });

    }

    static async getByUserId(id: number): Promise<Road[]> {
        const listOfRoad = await Road.findAll({
            where: { user: id }
        });

        if (!listOfRoad) {
            return [];
        }
        const aux = []
        const roads= listOfRoad.map((Road) => Road.get({ plain: true }));
        for (const road of roads) {
            const coordinatesOrigin = await Location.findByPk(road.origin);
            const coordinatesDestiny = await Location.findByPk(road.destination);
            road.origin = coordinatesOrigin;
            road.destination = coordinatesDestiny;
            aux.push(road);
        }
        return aux;
    }
}

export default RoadRepository;