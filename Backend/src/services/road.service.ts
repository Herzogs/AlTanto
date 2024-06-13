import { IRoad } from '../interfaces/road.interfaces';
import { IRoadRepository } from '../repository/interface/road.interface'
import RoadRepository from '../repository/road.repository';
import transformData from '../utilities/transformData.utilities'
import { RoadNotCreatedException, RoadNotFoundException } from '../exceptions/road.exceptions';
import { IRoadService } from './interfaces/road.service.interfaces';

class RoadService implements IRoadService<IRoad> {
    private roadRepository: IRoadRepository<IRoad>;

    constructor(roadRepository = RoadRepository) {
        this.roadRepository = roadRepository;
    }

    async getAllRoads() {
        const roads = await this.roadRepository.getAll();
        if (!roads)
            throw new RoadNotFoundException("No roads found");
        return roads.map((road) => transformData(road));
    }

    async getRouteById(id: number) {
        const road = await this.roadRepository.getById(id);
        if (!road)
            throw new RoadNotFoundException("Road not found");
        return transformData(road);
    }

    async createRoad(road: IRoad) {
        const roadCreated = await this.roadRepository.create(road);
        if (!roadCreated)
            throw new RoadNotCreatedException("Road could not be created");
        return transformData(roadCreated);
    }

    async getRoadsByUserId(id: string) {
        const roads = await this.roadRepository.getByUserId(+id);
        if (!roads)
            throw new RoadNotFoundException("No roads found");
        return roads.map((road) => transformData(road));
    }
}

export default new RoadService();
