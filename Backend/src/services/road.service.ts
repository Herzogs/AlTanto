import { IRoadDto } from '../models/road.interfaces';
import { IRoadRepository } from '../repository/interface/road.repository.interface'
import { RoadNotCreatedException, RoadNotFoundException } from '../exceptions/road.exceptions';
import { IRoadService } from './interfaces/road.service.interface';

class RoadService implements IRoadService<IRoadDto> {
    private roadRepository: IRoadRepository<IRoadDto>;

    constructor({roadRepository }: { roadRepository: IRoadRepository<IRoadDto> }) {
        this.roadRepository = roadRepository;
    }

    async getAllRoads() {
        const roads = await this.roadRepository.getAll();
        if (!roads)
            throw new RoadNotFoundException("No roads found");
        return roads;
    }

    async getRouteById(id: number) {
        const road = await this.roadRepository.getById(id);
        console.log("EN EL SERVICIO: ", road)
        if (road === null){
            return null
        }
        return road;
    }

    async createRoad(road: IRoadDto) {
        const roadCreated = await this.roadRepository.create(road);
        if (!roadCreated)
            throw new RoadNotCreatedException("Road could not be created");
        return roadCreated;
    }

    async getRoadsByUserId(id: string) {
        const roads = await this.roadRepository.getByUserId(+id);
        if (!roads)
            return []
        return roads
    }
}

export default RoadService;
