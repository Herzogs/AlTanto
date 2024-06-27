import { IGroup, IGroupMember } from "../../src/models/group.interface";
import GroupService from "../../src/services/group.service";
import { IGroupRepository } from "../../src/repository/interface/group.repository.interface";
import { IReportService } from "../../src/services/interfaces/report.service.interface";
import { IReportDto } from "../../src/models/reports.interface";
import { GroupNotCreatedException } from "../../src/exceptions/group.exceptions";

jest.mock('../../src/repository/group.repository');
jest.mock('../../src/services/report.service');

describe('GroupService', () => {
  let groupRepository: jest.Mocked<IGroupRepository<IGroup, IGroupMember>>;
  let reportService: jest.Mocked<IReportService<IReportDto>>;
  let groupService: GroupService;

  const mockGroup: IGroup = {
    id: 1,
    name: 'Test Group',
    ownerId: 1,
    groupCode: '12345'
  };

  const mockReport: IReportDto = {
    id: 1,
    content: 'This is a test report',
    createAt: new Date(),
    image: 'test_image.jpg',
    positiveScore: 10,
    negativeScore: 2,
    category: 'Test Category',
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    groupId: 1,
    userId: 1
  };

  beforeEach(() => {
    groupRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
      findByName: jest.fn(),
      findByOwner: jest.fn(),
      findByCode: jest.fn(),
      getGroupMembers: jest.fn()
    } as jest.Mocked<IGroupRepository<IGroup, IGroupMember>>;

    reportService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createReport: jest.fn(),
      getByUser: jest.fn(),
      getReportsByGroup: jest.fn(),
      disableOldReports: jest.fn(),
      scoringReport: jest.fn()
    } as jest.Mocked<IReportService<IReportDto>>;

    groupService = new GroupService({ groupRepository, reportService });
  });

  test('should create a group', async () => {
    groupRepository.create.mockResolvedValue(mockGroup);

    const result = await groupService.create(mockGroup);

    expect(result).toEqual(mockGroup);
    expect(groupRepository.create).toHaveBeenCalledWith(mockGroup);
  });

  test('should throw an error when creating a group fails', async () => {
    groupRepository.create.mockResolvedValue(null);

    await expect(groupService.create(mockGroup)).rejects.toThrow(GroupNotCreatedException);
    expect(groupRepository.create).toHaveBeenCalledWith(mockGroup);
  });

  test('should get all groups by owner', async () => {
    groupRepository.findByOwner.mockResolvedValue([mockGroup]);

    const result = await groupService.getAllByOwner(1);

    expect(result).toEqual([mockGroup]);
    expect(groupRepository.findByOwner).toHaveBeenCalledWith(1);
  });

  test('should remove a group', async () => {
    groupRepository.remove.mockResolvedValue(true);

    const result = await groupService.remove(1);

    expect(result).toBe(true);
    expect(groupRepository.remove).toHaveBeenCalledWith(1);
  });

  test('should validate group code', async () => {
    groupRepository.findByCode.mockResolvedValue(mockGroup);

    const result = await groupService.validateGroupCode('12345');

    expect(result).toBe(true);
    expect(groupRepository.findByCode).toHaveBeenCalledWith('12345');
  });

  test('should find group by name', async () => {
    groupRepository.findByName.mockResolvedValue(mockGroup);

    const result = await groupService.findByName('Test Group');

    expect(result).toEqual(mockGroup);
    expect(groupRepository.findByName).toHaveBeenCalledWith('Test Group');
  });

  test('should find group by id', async () => {
    groupRepository.findById.mockResolvedValue(mockGroup);

    const result = await groupService.findById(1);

    expect(result).toEqual(mockGroup);
    expect(groupRepository.findById).toHaveBeenCalledWith(1);
  });

  test('should find members by group id', async () => {
    const mockGroupMember: IGroupMember = {
      id: 1,
      name: 'Group Member Name',  
      ownerId: 1,  
      members: [
        {
          name: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com'
        }
      ]
    };
    groupRepository.getGroupMembers.mockResolvedValue(mockGroupMember);
  
    const result = await groupService.findMembersByGroupId(1);
  
    expect(result).toEqual(mockGroupMember);
    expect(groupRepository.getGroupMembers).toHaveBeenCalledWith(1);
  });

  test('should get notifications', async () => {
    groupRepository.findByOwner.mockResolvedValue([mockGroup]);
    reportService.getReportsByGroup.mockResolvedValue([mockReport]);

    const result = await groupService.getNotifications(1);

    expect(result).toEqual([{
      groupName: mockGroup.name,
      reports: [mockReport]
    }]);
    expect(groupRepository.findByOwner).toHaveBeenCalledWith(1);
    expect(reportService.getReportsByGroup).toHaveBeenCalledWith(mockGroup.id);
  });
});
