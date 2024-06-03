import Routes from "../models/Routes";
import { Location } from "../models/Location";
import { IRouteRequest } from "../interfaces/routes.interfaces";

class RoutesRepository {
    static async getAll(): Promise<Routes[]> {
        const listOfRoutess = await Routes.findAll({
            include: [{ model: Location, attributes: ['latitude', 'longitude'] }],
            attributes: { exclude: ['LocationId'] }
        });
        if (!listOfRoutess) {
            return [];
        }
        return listOfRoutess.map((Routes) => Routes.get({ plain: true }));
    }

    static async getById(id: number): Promise<Routes | null> {
        const routes = await Routes.findByPk(
            id,
            {
                include: [{ model: Location, attributes: ['latitude', 'longitude'] }],
                attributes: { exclude: ['LocationId'] }
            });
        if (!routes) {
            return null;
        }
        return routes.get({ plain: true });
    }

    static async create(routes: IRouteRequest): Promise<Routes | null> {
        const locationSearchedOrigin = await Location.findOrCreate({
            where: { latitude: routes.origin.lat, longitude: routes.origin.lng },
        })
        const locationSearchedDestiny = await Location.findOrCreate({
            where: { latitude: routes.destination.lat, longitude: routes.destination.lng },
        })
        const locationOrigin = locationSearchedOrigin[0].get({ plain: true });
        const locationDestiny = locationSearchedDestiny[0].get({ plain: true });
        const RoutesCreated = await Routes.create({
            name: Routes.name,
            originId: locationOrigin.id,
            destinationId: locationDestiny.id
        });
        if (!RoutesCreated) return null
        return RoutesCreated.get({ plain: true });
    }
}

export default RoutesRepository;