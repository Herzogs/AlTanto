import { Lifetime } from 'awilix';
import container from '../../src/container';
import ZoneService from '../../src/services/zone.service';
import { IZoneDto } from '../../src/models/zone.interface';
import ZoneController from '../../src/controllers/zone.controller';
import * as validationZones from '../../src/validator/zone.validator';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../src/services/zone.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
        };
    });
});

jest.mock('../../src/validator/zone.validator', () => {
    return {
        createZoneValidator: {
            safeParseAsync: jest.fn(),
        },
        getZoneByIdValidator: {
            safeParseAsync: jest.fn(),
        },
    };
});

describe('ZoneController', () => {
    let zoneController: ZoneController;
    let zoneService: jest.Mocked<ZoneService>;

    beforeAll(() => {
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        zoneService = container.resolve<ZoneService>('zoneService') as jest.Mocked<ZoneService>;
        zoneController = new ZoneController({ zoneService });
    });

    const zoneData: IZoneDto = {
        name: 'Test Zone',
        location: { lat: "10.0", lon: "20.0" },
        rad: 50,
        userId: 1,
    };

    test('should create a zone', async () => {
        const req = { body: zoneData } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationZones.createZoneValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: zoneData });

        zoneService.create.mockResolvedValue(zoneData);

        await zoneController.create(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(zoneData);
    });

    test('should get all zones', async () => {
        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        zoneService.getAll.mockResolvedValue([zoneData]);

        await zoneController.getAll(req, res, next);

        expect(zoneService.getAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([zoneData]);
    });

    test('should get a zone by id', async () => {
        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationZones.getZoneByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });

        zoneService.getById.mockResolvedValue(zoneData);

        await zoneController.getById(req, res, next);

        expect(zoneService.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(zoneData);
    });

    test('should return bad request error when creating a zone with invalid data', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid name', path: ['name'] },
                    { message: 'Invalid latitude', path: ['latitude'] }
                ]
            }
        };

        (validationZones.createZoneValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { body: {} } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await zoneController.create(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: invalidDataResult.error.errors[0].message, statusCode: 400 });
    });

    test('should return bad request error when getting a zone by id with invalid data', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid id', path: ['id'] },
                ]
            }
        };

        (validationZones.getZoneByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { params: { id: 'invalid' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await zoneController.getById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: invalidDataResult.error.errors[0].message, statusCode: 400 });
    });

    test('should return server error when creating a zone', async () => {
        const req = { body: zoneData } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationZones.createZoneValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: zoneData });

        zoneService.create.mockRejectedValue(new Error('Server error'));

        await zoneController.create(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Server error', statusCode: 500 });
    });
});
