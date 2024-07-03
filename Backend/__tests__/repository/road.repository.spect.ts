import {RoadMock}   from "../mocks/road.mock";
import {LocationMock} from "../mocks/location.mock";
import RoadRepository from "../../src/repository/road.repository";
import {IRoadDto} from "../../src/models/road.interfaces";

describe('RoadRepository',()=>{
    let roadRepository:RoadRepository;
    beforeAll(()=>{
        roadRepository= new RoadRepository({Road: RoadMock, Location:LocationMock});
    })

    it('should create a new road', async () => {

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
        const roadCreated= await roadRepository.create(roadData);
        expect(roadCreated).toBeDefined();
        expect(roadCreated?.name).toEqual(roadData.name);
    })




})