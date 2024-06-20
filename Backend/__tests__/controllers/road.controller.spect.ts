import { Lifetime } from 'awilix';
import container from '../../src/container';
import RoadService from '../../src/services/road.service';
import { IRoadDto } from '../../src/models/road.interfaces';
import RoadController from '../../src/controllers/road.controller';
import * as validationRoutes from '../../src/validator/road.validatos';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../src/services/road.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            createRoad: jest.fn(),
            getRouteById: jest.fn(),
            getAllRoads: jest.fn(),
            getRoadsByUserId: jest.fn(),
        };
    });
});

jest.mock('../../src/validator/road.validatos', () => {
    return {
        getRoadByIdValidator: {
            safeParseAsync: jest.fn(),
        },
        getRoadsByUserIDlValidator: {
            safeParseAsync: jest.fn(),
        },
        createRoadValidator: {
            safeParseAsync: jest.fn(),
        },
    };
});

describe('Road Controller', () => {
    let roadService: jest.Mocked<RoadService>;
    let roadController: RoadController;

    const roadData: IRoadDto = {
        name: 'Test Road',
        addressOrigin: '123 Test St',
        addressDestiny: '456 Test Ave',
        origin: { lat: 10.0, lng: 20.0 },
        destination: { lat: 30.0, lng: 40.0 },
        distance: 50,
        duration: 60,
        user: 1,
    };

    beforeAll(() => {
        //config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        //await dbConnection.sync({ force: true });
        roadService = container.resolve<RoadService>('roadService') as jest.Mocked<RoadService>;
        roadController = new RoadController({ roadService });
    });

    test('should create a road', async () => {
        (validationRoutes.createRoadValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: roadData });
        roadService.createRoad.mockResolvedValue(roadData);

        const req = { body: roadData } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.createRoad(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(roadData);
    });

    test('should return bad request error when creating a road with invalid data', async () => {
        
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid name', path: ['name'] },
                    { message: 'Invalid address', path: ['addressOrigin'] }
                ]
            }
        };
        
        (validationRoutes.createRoadValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { body: {} } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.createRoad(req, res, next);

        const listOfErrors = invalidDataResult.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')
            };
        });

        expect(next).toHaveBeenCalledWith({ message: listOfErrors, statusCode: 400 });
    });

    test('should get a road by id', async () => {
        (validationRoutes.getRoadByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });
        roadService.getRouteById.mockResolvedValue(roadData);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.getRouteById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(roadData);
    });

    test('should return bad request error when getting a road by id with validation failed', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid name', path: ['name'] },
                    { message: 'Invalid address', path: ['addressOrigin'] }
                ]
            }
        };
        (validationRoutes.getRoadByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.getRouteById(req, res, next);

        const listOfErrors = invalidDataResult.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')
            };
        });

        expect(next).toHaveBeenCalledWith({ message:listOfErrors, statusCode: 400 });
    });

    test('should return not found error when getting a road by id that does not exist', async () => {
        (validationRoutes.getRoadByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });
        roadService.getRouteById.mockResolvedValue(null);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.getRouteById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Road not found', statusCode: 404 });
    })

    test('should get all roads', async () => {
        const roads = [roadData];
        roadService.getAllRoads.mockResolvedValue(roads);

        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        roadService.getAllRoads.mockResolvedValue(roads);

        await roadController.getAllRoads(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(roads);
    });

    test('should get roads by user id', async () => {
        (validationRoutes.getRoadsByUserIDlValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });
        const roads = [roadData];
        roadService.getRoadsByUserId.mockResolvedValue(roads);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.getRoadsByUserId(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(roads);
    });

    test('should return bad request error when getting roads by user id with validation failed', async () => {
        const invalidDataResult = {
            success: false,
            error: {
                errors: [
                    { message: 'Invalid id', path: ['id'] }
                ]
            }
        };
        (validationRoutes.getRoadsByUserIDlValidator.safeParseAsync as jest.Mock).mockResolvedValue(invalidDataResult);

        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await roadController.getRoadsByUserId(req, res, next);

        const listOfErrors = invalidDataResult.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')
            };
        });

        expect(next).toHaveBeenCalledWith({ message:listOfErrors, statusCode: 400 });
    })
});
