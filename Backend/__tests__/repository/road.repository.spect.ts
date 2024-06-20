import RoadRepository from "../../src/repository/road.repository";
import { IRoadDto } from "../../src/models/road.interfaces";
import container from "../../src/container";
import { config } from "dotenv";
import { Lifetime } from "awilix";
import UserRepository from "../../src/repository/user.repository"; // Corrige el path de importación
import dbConnection from "../../src/config/dbConnection.config";

describe('Road Repository', () => {
    let roadRepository: RoadRepository;
    let userRepository: UserRepository;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED],
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
        ]);
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
        roadRepository = container.resolve<RoadRepository>('roadRepository');
        userRepository = container.resolve<UserRepository>('userRepository');
    });

    test('should create a road', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });

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

        const createdRoad = await roadRepository.create(roadData);
        expect(createdRoad).toBeDefined();
        expect(createdRoad!.name).toBe(roadData.name);
    });

    test('should get a road by id', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });

        const roadData: IRoadDto = {
            name: 'Another Test Road',
            addressOrigin: '789 Test St',
            addressDestiny: '101 Test Ave',
            origin: { lat: 11.0, lng: 21.0 },
            destination: { lat: 31.0, lng: 41.0 },
            distance: 51,
            duration: 61,
            user: 1,
        };

        const createdRoad = await roadRepository.create(roadData);
        const fetchedRoad = await roadRepository.getById(createdRoad!.id as number);
        expect(fetchedRoad).toBeDefined();
        expect(fetchedRoad?.name).toBe(roadData.name);
    });

    test('should get all roads', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });

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

        await roadRepository.create(roadData);
        const roads = await roadRepository.getAll();
        expect(roads).toBeDefined();
        expect(roads.length).toBeGreaterThan(0);
    });

    test('should give null if user created an existed route', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });

        const roadData: IRoadDto = {
            name: 'Another Test Road',
            addressOrigin: '789 Test St',
            addressDestiny: '101 Test Ave',
            origin: { lat: 11.0, lng: 21.0 },
            destination: { lat: 31.0, lng: 41.0 },
            distance: 51,
            duration: 61,
            user: 1,
        };

        await roadRepository.create(roadData);
        const createdRoad2 = await roadRepository.create(roadData);
        expect(createdRoad2).toBeNull();
    });
});
