import { IZoneDto, IZoneReport, ZoneUser } from "../models/zone.interface";
import { IZoneRepository } from "../repository/interface/zone.repository.interface";
import { ZoneNotFoundException } from "../exceptions/zone.exceptions";
//import { IReport, IReportDto } from "../models/reports.interface";
import { IZoneService } from "./interfaces/zone.service.interface";


class ZoneService implements IZoneService<IZoneDto, IZoneReport> {
    private zoneRepository: IZoneRepository<IZoneDto, object>;

    constructor({ zoneRepository }: { zoneRepository: IZoneRepository<IZoneDto, object> }) {
        this.zoneRepository = zoneRepository;
    }

    async create(newZone: IZoneDto): Promise<IZoneDto | null> {
        const zoneCreated = await this.zoneRepository.create(newZone);
        return zoneCreated;
    }

    async getAll(): Promise<IZoneDto[]> {
        const listOfZones = await this.zoneRepository.getAll();
        return listOfZones;
    }

    async getAllByUserId(userId: number): Promise<IZoneDto[]> {
        const listOfZones = await this.zoneRepository.getAllByUserId(userId);
        return listOfZones;
    }

    async getById(zoneId: number): Promise<IZoneDto | null> {
        const zoneSearched = await this.zoneRepository.getById(zoneId);
        return zoneSearched;
    }

    async getNotification(userId: number): Promise<IZoneReport[]> {
        const zones = await this.getAllByUserId(userId);
        const reportByZone: IZoneReport[] = [];
        for (const myZone of zones) {
            const result = await this.zoneRepository.getReports(myZone);
            if (result === undefined) throw new ZoneNotFoundException("Reports not found");
            reportByZone.push({
                zoneName: myZone.name,
                reports: result as object[]
            });
        }
        return reportByZone;
    }

    async getFilteredReports(obj: IZoneDto): Promise<IZoneReport[]> {
        const zones = await this.zoneRepository.getReports(obj);
        return zones as IZoneReport[];
    }

    async findZoneByLocation(lat: number, lon: number): Promise<NonNullable<ZoneUser[]>> {
        const zone = await this.zoneRepository.findZoneByReport({ lat: lat.toString(), lon: lon.toString() });
        if (zone === null) throw new ZoneNotFoundException("Zone not found");
        return zone as NonNullable<ZoneUser[]>;
    }

}

export default ZoneService;