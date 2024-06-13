import Road from "./models/Road";
import { Location } from "./models/Location";
import { IRoad } from "../interfaces/road.interfaces";
import {IRoadRepository} from "./interface/road.interface";


class RoadRepository implements IRoadRepository<IRoad>{

    private roadModel: typeof Road;

    constructor(roadModel = Road) {
        this.roadModel = roadModel;
    }

    async getAll(): Promise<IRoad[]> {
        const listOfRoad = await this.roadModel.findAll({
            include: [{ model: Location, attributes: ['latitude', 'longitude'] }],
            attributes: { exclude: ['LocationId'] }
        });
        if (!listOfRoad) {
            return [];
        }
        return listOfRoad.map((Road) => Road.get({ plain: true }));
    }

    async getById(id: number): Promise<IRoad | null> {
        const roadSearched = await this.roadModel.findByPk(id);

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

    async create(road: IRoad): Promise<IRoad | null> {

        const locationSearchedOrigin = await Location.findOrCreate({
            where: { latitude: road.origin.lat, longitude: road.origin.lng }
        })

        const locationSearchedDestiny = await Location.findOrCreate({
            where: { latitude: road.destination.lat, longitude: road.destination.lng },
        })
        const locationOrigin = locationSearchedOrigin[0].get({ plain: true });
        const locationDestiny = locationSearchedDestiny[0].get({ plain: true });

        const roadCreated = await this.roadModel.create({
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

    async getByUserId(id: number): Promise<IRoad[]> {
        const listOfRoad = await this.roadModel.findAll({
            where: { user: id }
        });

        if (!listOfRoad) {
            return [];
        }
        const aux = []
        const roads = listOfRoad.map((Road) => Road.get({ plain: true }));
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

export default new RoadRepository()