import { Location } from "./entities/Location";
import Road from "./entities/Road";
import { IRoadDto } from "../models/road.interfaces";
import { IRoadRepository } from "./interface/road.repository.interface";
import { ModelCtor } from "sequelize";


class RoadRepository implements IRoadRepository<IRoadDto> {

    private roadModel: ModelCtor<Road>;

    constructor({ Road }: { Road: ModelCtor<Road> }) {
        this.roadModel = Road;
    }

    async getAll(): Promise<IRoadDto[]> {
        const listOfRoad = await this.roadModel.findAll();
        console.log("en road repository");

        if (!listOfRoad) {
            return [];
        }

        const listOfRoads = listOfRoad.map((road) => road.get({ plain: true }));

        const aux: IRoadDto[] = [];

        for (const Route of listOfRoads) {

            const coordinatesOrigin = await Location.findByPk(Route.origin);
            const coordinatesDestiny = await Location.findByPk(Route.destination);

            aux.push({
                id: Route.id,
                name: Route.name,
                addressOrigin: Route.addressOrigin,
                addressDestiny: Route.addressDestiny,
                origin: coordinatesOrigin ? {
                    lat: +coordinatesOrigin.getDataValue('latitude'),
                    lng: +coordinatesOrigin.getDataValue('longitude'),
                } : { lat: 0, lng: 0 },
                destination: coordinatesDestiny ? {
                    lat: +coordinatesDestiny.getDataValue('latitude'),
                    lng: +coordinatesDestiny.getDataValue('longitude'),
                } : { lat: 0, lng: 0 },
                distance: Route.distance,
                duration: Route.duration,
                user: Route.user
            });

        }
        return aux;
    }

    async getById(id: number): Promise<IRoadDto | null> {
        const roadSearched = await this.roadModel.findByPk(id,
            {
                include: [{ model: Location, attributes: ['latitude', 'longitude'] }],
                attributes: { exclude: ['LocationId'] }
            }
        );

        if (!roadSearched) {
            return null;
        }
        const road = roadSearched.get({ plain: true });
        const coordinatesOrigin = await Location.findByPk(road.origin);
        const coordinatesDestiny = await Location.findByPk(road.destination);
        return {
            id: road.id,
            name: road.name,
            addressOrigin: road.addressOrigin,
            addressDestiny: road.addressDestiny,
            origin: {
                lat: +coordinatesOrigin!.latitude,
                lng: +coordinatesOrigin!.longitude
            },
            destination: {
                lat: +coordinatesDestiny!.latitude,
                lng: +coordinatesDestiny!.longitude
            },
            distance: road.distance,
            duration: road.duration,
            user: road.user
        };
    }

    async create(road: IRoadDto): Promise<IRoadDto | null> {

       /*  const routeSearched = await this.roadModel.findOne({
            where: {
                addressOrigin: road.addressOrigin,
                addressDestiny: road.addressDestiny,
                
            }
        })

        if (routeSearched) return null */

        const locationSearchedOrigin = await Location.findOrCreate({
            where: { latitude: road.origin.lat, longitude: road.origin.lng }
        })

        const locationSearchedDestiny = await Location.findOrCreate({
            where: { latitude: road.destination.lat, longitude: road.destination.lng },
        })
        const locationOrigin = locationSearchedOrigin[0].get({ plain: true });
        const locationDestiny = locationSearchedDestiny[0].get({ plain: true });
        if (!locationOrigin || !locationDestiny) return null

        const roadCreated = await this.roadModel.create({
            name: road.name,
            addressOrigin: road.addressOrigin,
            addressDestiny: road.addressDestiny,
            origin: +locationOrigin.id!,
            destination: +locationDestiny.id!,
            distance: road.distance,
            duration: road.duration,
            user: road.user,
        });
        if (!roadCreated) return null
        const savedRoad = roadCreated.get({ plain: true });
        return {
            id: savedRoad.id,
            name: savedRoad.name,
            addressOrigin: savedRoad.addressOrigin,
            addressDestiny: savedRoad.addressDestiny,
            origin: road.origin,
            destination: road.destination,
            distance: savedRoad.distance,
            duration: savedRoad.duration,
            user: savedRoad.user
        };

    }

    async getByUserId(id: number): Promise<IRoadDto[]> {

        const listOfRoad = await this.roadModel.findAll({
            where: { user: id }
        });
        if (!listOfRoad) {
            return [];
        }
        const aux: IRoadDto[] = []
        const listOfRoads = listOfRoad.map((Road) => Road.get({ plain: true }));
        for (const Route of listOfRoads) {

            const coordinatesOrigin = await Location.findByPk(Route.origin);
            const coordinatesDestiny = await Location.findByPk(Route.destination);

            aux.push({
                id: Route.id,
                name: Route.name,
                addressOrigin: Route.addressOrigin,
                addressDestiny: Route.addressDestiny,
                origin: coordinatesOrigin ? {
                    lat: +coordinatesOrigin.getDataValue('latitude'),
                    lng: +coordinatesOrigin.getDataValue('longitude'),
                } : { lat: 0, lng: 0 },
                destination: coordinatesDestiny ? {
                    lat: +coordinatesDestiny.getDataValue('latitude'),
                    lng: +coordinatesDestiny.getDataValue('longitude'),
                } : { lat: 0, lng: 0 },
                distance: Route.distance,
                duration: Route.duration,
                user: Route.user
            });

        }
        return aux;
    }
}

export default RoadRepository