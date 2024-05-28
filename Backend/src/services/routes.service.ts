import { IRouteResponse } from "interfaces/routes.interfaces";
import * as routesRepository from "../repository/routes.repository";

async function getRoutes(): Promise<IRouteResponse[]> {
    const listOfRoutes = await routesRepository.default.getAll();
    if (!listOfRoutes) {
        throw new Error("No routes found");
    }
    const list: IRouteResponse[] = listOfRoutes.map((route) => {
        return {
            id: route.id,
            name: route.name,
            origin: {
                lat: route.originId.lat,
                lng: route.originId.lng,
            },
            destination: {
                lat: route.destinationId.latitude,
                lng: route.destinationId.longitude,
            },
            enabled: route.enabled,
        };
    })
    return list;
}

export { getRoutes}
