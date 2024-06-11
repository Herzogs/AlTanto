/* eslint-disable @typescript-eslint/no-explicit-any */
import {IZone, IZoneRequest, IZoneResponse} from "../interfaces/zone.interface";
import * as zoneRepository from '../repository/zone.repository';
import transformData from '../utilities/transformData.utilities';
import {ZoneNotCreatedException, ZoneNotFoundException} from '../exceptions/zone.exceptions';
import {getReportsByLatLongRadius} from "./report.service";
import {IReportWithRadius} from "../interfaces/reports.interface";


const createZone = async (newZone: IZoneRequest): Promise<IZone> => {
    const zoneCreated = await zoneRepository.default.create(newZone);
    if (!zoneCreated) throw new ZoneNotCreatedException("Zone not created");
    return zoneCreated;
}


const getAllZone = async (): Promise<IZoneResponse[]> => {
    const listOfZones:IZone[] = await zoneRepository.default.getAllZone();
    if (!listOfZones) throw new ZoneNotFoundException("Zones not found");
    return listOfZones.map(transformData);

}

const getAllZoneByUserId = async (userId: number): Promise<IZoneResponse[]> => {
    const listOfZones:IZone[] = await zoneRepository.default.getAllZoneByUserId(userId);
    if (!listOfZones) throw new ZoneNotFoundException("Zones not found");
    return listOfZones.map(transformData);

}

const getZoneById = async (zoneId: number) => {
    const zoneSearched = await zoneRepository.default.getZoneById(zoneId);
    if (!zoneSearched) throw new ZoneNotFoundException("Zone not found");
    return transformData(zoneSearched);
}

interface IZoneReport {
    zoneName: string;
    reports: any[];
}

const getNotification = async (userId: number): Promise<IZoneReport[]> => {
    const zones:IZoneResponse[] = await getAllZoneByUserId(userId);
    const reportByZone: IZoneReport[] = [];
    for (const myZone of zones) {
        const reportParams: IReportWithRadius = {
            lat: myZone.location.latitude.toString(),
            lon: myZone.location.longitude.toString(),
            rad: myZone.radio.toString()
        };
        const result = await getReportsByLatLongRadius(reportParams);
        if (!result) throw new ZoneNotFoundException("Reports not found");
        reportByZone.push({
            zoneName: myZone.name,
            reports: result
        });
    }
    return reportByZone;
}

export {createZone, getAllZone, getZoneById, getNotification, getAllZoneByUserId}
