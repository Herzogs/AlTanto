import { Lifetime } from 'awilix';
import container from '../../src/container';
import RoadService from '../../src/services/road.service';
import RoadRepository from '../../src/repository/road.repository';
import UserRepository from '../../src/repository/user.repository';
import { config } from 'dotenv';
import { IRoadDto } from '../../src/models/road.interfaces';
import { IUser } from '../../src/models/user.interface'; 

jest.mock('../../src/repository/road.repository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            getByUserId: jest.fn(),
        };
    });
});

describe('Road Service', () => {
    let roadService: RoadService;
    let userRepository: UserRepository;
    let roadRepository: jest.Mocked<RoadRepository>;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        roadRepository = container.resolve<RoadRepository>('roadRepository') as jest.Mocked<RoadRepository>;
    });

    beforeEach(async () => {
        roadService = container.resolve<RoadService>('roadService');
        userRepository = container.resolve<UserRepository>('userRepository');    
    });

    test('should create a road', async () => {
        const user: IUser = {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            password: 'password123',
            phoneNumber: '1234567890',
            email: 'john.doe@example.com',
        };

        await userRepository.create(user);

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

        roadRepository.create.mockResolvedValue(roadData);
        
        const createdRoad = await roadService.createRoad(roadData);
        
        expect(createdRoad).toBeDefined();
        expect(createdRoad!.name).toBe(roadData.name);
    });

    test('should get road by id', async () => {
        const user: IUser = {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            password: 'password123',
            phoneNumber: '1234567890',
            email: 'john.doe@example.com',
        };

        await userRepository.create(user);

        const roadData: IRoadDto = {
            name: 'Test Road',
            addressOrigin: '123 Test St',
            addressDestiny: '456 Test Ave',
            origin: { lat: 10.0, lng: 20.0 },
            destination: { lat: 30.0, lng: 40.0 },
            distance: 50,
            duration: 60,
            user: 1, // Debe ser el ID del usuario creado
        };

        roadRepository.getById.mockResolvedValue(roadData);

        const road = await roadService.getRouteById(1);

        expect(road).toBeDefined();
        expect(road!.name).toBe(roadData.name);
    });

    test('should return null when road not found', async () => {
        roadRepository.getById.mockResolvedValue(null);
        const road = await roadService.getRouteById(1);
        expect(road).toBeNull();
    });

    test('should get all roads del usuario', async () => {
        const user: IUser = {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            password: 'password123',
            phoneNumber: '1234567890',
            email: 'john.doe@example.com',
        };

        await userRepository.create(user);

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

        roadRepository.getByUserId.mockResolvedValue([roadData]);

        const roads = await roadService.getRoadsByUserId('1');

        expect(roads).toBeDefined();
        expect(roads).toHaveLength(1);
        expect(roads[0].name).toBe(roadData.name);
    });

    test('should return empty array when no roads found', async () => {
        roadRepository.getByUserId.mockResolvedValue([]);
        const roads = await roadService.getRoadsByUserId('1');
        expect(roads).toBeDefined();
        expect(roads).toHaveLength(0);
    });
});
