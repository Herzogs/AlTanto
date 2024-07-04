import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import * as userService from '@services/userService';

vi.mock('@interceptors/axiosConfig');

describe('UserService', () => {
  it('should fetch user by username', async () => {
    const mockResponse = {
      data: { id: 1, username: 'testuser', email: 'testuser@example.com' },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const username = 'testuser';
    const user = await userService.getUserByUsername(username);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/user/name/${username}`);

    expect(user).toEqual({ id: 1, username: 'testuser', email: 'testuser@example.com' });
  });

  it('should fetch user by ID', async () => {
    const mockResponse = {
      data: { id: 1, username: 'user1', email: 'user1@example.com' },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const userId = 1;
    const user = await userService.getUserById(userId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/user/${userId}`);

    expect(user).toEqual({ id: 1, username: 'user1', email: 'user1@example.com' });
  });

  it('should update user data', async () => {
    const userId = 1;
    const userDataToUpdate = {
      username: 'updateduser',
      email: 'updateduser@example.com',
    };

    const mockResponse = {
      data: { id: 1, ...userDataToUpdate },
    };

    axiosInstance.put.mockResolvedValue(mockResponse);

    const updatedUser = await userService.updateUser(userId, userDataToUpdate);

    expect(axiosInstance.put).toHaveBeenCalledWith(`/user/update/${userId}`, userDataToUpdate);

    expect(updatedUser).toEqual({ id: 1, username: 'updateduser', email: 'updateduser@example.com' });
  });
});
