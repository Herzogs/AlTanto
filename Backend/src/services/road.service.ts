import { IRoad } from '../interfaces/road.interfaces';
import * as roadRepository from '../repository/road.repository'
import transformData from '../utilities/transformData.utilities'
import { RoadNotCreatedException, RoadNotFoundException } from '../exceptions/road.exceptions';

const getAllRoads = async () => {
    const roads = await roadRepository.default.getAll();
    if (!roads) 
        throw new RoadNotFoundException("No roads found");
    return roads.map((road) => transformData(road));
}

const getRouteById = async (id: number) => {
    const road = await roadRepository.default.getById(id);
    if (!road) 
      throw new RoadNotFoundException("Road not found");
    return transformData(road);
}

const createRoad = async (road: IRoad) => {
    const roadCreated = await roadRepository.default.create(road);
    if (!roadCreated) 
        throw new RoadNotCreatedException("Road could not be created");
    return transformData(roadCreated);
}

const getRoadsByUserId = async (id: string) => {
    
    const roads = await roadRepository.default.getByUserId(+id);
   
    if (!roads) 
        throw new RoadNotFoundException("No roads found");
    return roads.map((road) => transformData(road));
}

export { getAllRoads, createRoad, getRouteById, getRoadsByUserId};
