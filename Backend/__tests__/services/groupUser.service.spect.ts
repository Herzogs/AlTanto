import { IGroupUser } from "../../src/models/group.interface";
import GroupUserService from "../../src/services/groupUser.service";
import { IGroupUserRepository } from "../../src/repository/interface/groupUser.repository.interface";
import { UserNotFoundException } from "../../src/exceptions/users.exceptions";

jest.mock('../../src/repository/groupUser.repository');

describe('GroupUserService', () => {
  let groupUserRepository: jest.Mocked<IGroupUserRepository<IGroupUser>>;
  let groupUserService: GroupUserService;

  const mockGroupUser: IGroupUser = {
    userId: 1,
    groupId: 1
  };

  beforeEach(() => {
    groupUserRepository = {
      create: jest.fn(),
      remove: jest.fn(),
      findAllByUserId: jest.fn(),
      getMembers: jest.fn()
    } as jest.Mocked<IGroupUserRepository<IGroupUser>>;

    groupUserService = new GroupUserService({ groupUserRepository });
  });

  test('should add a user to a group', async () => {
    groupUserRepository.create.mockResolvedValue(mockGroupUser);

    const result = await groupUserService.addUser(mockGroupUser);

    expect(result).toEqual(mockGroupUser);
    expect(groupUserRepository.create).toHaveBeenCalledWith(mockGroupUser);
  });

  test('should throw an error when adding a user to a group fails', async () => {
    groupUserRepository.create.mockResolvedValue(null);

    await expect(groupUserService.addUser(mockGroupUser)).rejects.toThrow(UserNotFoundException);
    expect(groupUserRepository.create).toHaveBeenCalledWith(mockGroupUser);
  });

  test('should remove a user from a group', async () => {
    groupUserRepository.remove.mockResolvedValue(true);

    const result = await groupUserService.removeUser(mockGroupUser);

    expect(result).toBe(true);
    expect(groupUserRepository.remove).toHaveBeenCalledWith(mockGroupUser);
  });

  test('should throw an error when removing a user from a group fails', async () => {
    groupUserRepository.remove.mockResolvedValue(false);

    await expect(groupUserService.removeUser(mockGroupUser)).rejects.toThrow(UserNotFoundException);
    expect(groupUserRepository.remove).toHaveBeenCalledWith(mockGroupUser);
  });

  test('should find all groups by user ID', async () => {
    const mockGroupUsers = [mockGroupUser];
    groupUserRepository.findAllByUserId.mockResolvedValue(mockGroupUsers);

    const result = await groupUserService.findAllByUserId(1);

    expect(result).toEqual(mockGroupUsers);
    expect(groupUserRepository.findAllByUserId).toHaveBeenCalledWith(1);
  });
});
