import {RoadMock} from "../mocks/road.mock";
import {LocationMock} from "../mocks/location.mock";
import RoadRepository from "../../src/repository/road.repository";
import {IRoadDto} from "../../src/models/road.interfaces";

describe('RoadRepository', () => {
    let roadRepository: RoadRepository;
    beforeAll(() => {
        roadRepository = new RoadRepository({Road: RoadMock, Location: LocationMock});
    })

    it('should create a new road', async () => {

        const roadData: IRoadDto = {
            name: 'Test Road',
            addressOrigin: '123 Test St',
            addressDestiny: '456 Test Ave',
            origin: {lat: 10.0, lng: 20.0},
            destination: {lat: 30.0, lng: 40.0},
            distance: 50,
            duration: 60,
            user: 1,
        };
        const roadCreated = await roadRepository.create(roadData);
        expect(roadCreated).toBeDefined();
        expect(roadCreated?.name).toEqual(roadData.name);
    })
    it('should return null on road creation error', async () => {
        const roadData: IRoadDto = {
            name: 'Test Road',
            addressOrigin: '123 Test St',
            addressDestiny: '456 Test Ave',
            origin: {lat: 10.0, lng: 20.0},
            destination: {lat: 30.0, lng: 40.0},
            distance: 50,
            duration: 60,
            user: 1,
        };

        LocationMock.findOrCreate = jest.fn().mockResolvedValueOnce([
            {get: () => ({id: 1})},
            {get: () => ({id: 2})},
        ]);


        RoadMock.create = jest.fn().mockRejectedValue(new Error("Error create road"))
        const roadCreated = await roadRepository.create(roadData);

        expect(roadCreated).toBeNull();


    });

    it('should return road by id', async () => {
        const mockRoadId = 1;
        const mockRoadData: IRoadDto = {
            id: mockRoadId,
            name: 'Test Road',
            addressOrigin: '123 Test St',
            addressDestiny: '456 Test Ave',
            origin: {lat: 10.0, lng: 20.0},
            destination: {lat: 30.0, lng: 40.0},
            distance: 50,
            duration: 60,
            user: 1,
        };

        // Mockear findByPk de roadModel para devolver el mockRoadData cuando se llame con mockRoadId
        RoadMock.findByPk = jest.fn().mockResolvedValueOnce(RoadMock.build(mockRoadData));

        // Mockear findByPk de locationModel para devolver las coordenadas
        LocationMock.findByPk = jest.fn().mockImplementation((id) => {
            if (id === mockRoadData.origin) {
                return Promise.resolve(LocationMock.build({latitude: '10.0', longitude: '20.0'}));
            } else if (id === mockRoadData.destination) {
                return Promise.resolve(LocationMock.build({latitude: '30.0', longitude: '40.0'}));
            } else {
                return Promise.resolve(null);
            }
        });

        const roadById = await roadRepository.getById(mockRoadId);

        expect(roadById).toBeDefined();
        expect(roadById?.id).toEqual(mockRoadData.id);
        expect(roadById?.name).toEqual(mockRoadData.name);
        expect(roadById?.addressOrigin).toEqual(mockRoadData.addressOrigin);
        expect(roadById?.addressDestiny).toEqual(mockRoadData.addressDestiny);
        expect(roadById?.origin).toEqual(mockRoadData.origin);
        expect(roadById?.destination).toEqual(mockRoadData.destination);
        expect(roadById?.distance).toEqual(mockRoadData.distance);
        expect(roadById?.duration).toEqual(mockRoadData.duration);
        expect(roadById?.user).toEqual(mockRoadData.user);


        expect(LocationMock.findByPk).toHaveBeenCalledWith(mockRoadData.origin);
        expect(LocationMock.findByPk).toHaveBeenCalledWith(mockRoadData.destination);
    });

    it('should return null for non-existent road', async () => {
        const nonExistentRoadId = 999; // ID que no existe en los mocks

        RoadMock.findByPk = jest.fn().mockResolvedValueOnce(null);
        const roadById = await roadRepository.getById(nonExistentRoadId);

        expect(roadById).toBeNull();

    });


    it('should return a list of roads with correct coordinates', async () => {
        // Mock de findAll para RoadMock
        RoadMock.findAll = jest.fn().mockResolvedValue([
            RoadMock.build({
                id: 1,
                name: 'Test Road 1',
                addressOrigin: '123 Test St',
                addressDestiny: '456 Test Ave',
                origin: 1,
                destination: 1,
                distance: 50,
                duration: 60,
                user: 1
            })
        ]);

        // Mock de findByPk para LocationMock
        LocationMock.findByPk = jest.fn().mockResolvedValueOnce(LocationMock.build({
            id: 1,
            latitude: 10.0,
            longitude: 20.0
        }))


        const roads: IRoadDto[] = await roadRepository.getAll();

        expect(RoadMock.findAll).toHaveBeenCalledTimes(1);
        expect(LocationMock.findByPk).toHaveBeenCalledTimes(2);

        expect(roads).toHaveLength(1);

    });

    it('should return an empty array if no roads found', async () => {
        // Mockear findAll de roadModel para devolver un array vacío cuando se llame
        RoadMock.findAll = jest.fn().mockResolvedValue([]);

        const allRoads = await roadRepository.getAll();

        expect(allRoads).toBeDefined();
        expect(allRoads).toEqual([]);

        // Verificar que se llamó a findAll en roadModel
        expect(RoadMock.findAll).toHaveBeenCalled();
    });


})