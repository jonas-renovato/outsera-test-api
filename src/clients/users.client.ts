import type { APIRequestContext, APIResponse } from '@playwright/test';
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from '../contracts/users.contract';
import { BaseClient } from './base.client';

export class UsersClient extends BaseClient {
  public constructor(request: APIRequestContext) {
    super(request);
  }

  public getUsers(page = 1): Promise<APIResponse> {
    return this.get('/users', { limit: 30, skip: (page - 1) * 30 });
  }

  public getUser(userId: number | string): Promise<APIResponse> {
    return this.get(`/users/${userId}`);
  }

  public createUser(payload: CreateUserRequest | Record<string, unknown>): Promise<APIResponse> {
    return this.post('/users/add', payload);
  }

  public updateUser(
    userId: number,
    payload: UpdateUserRequest | Record<string, unknown>,
  ): Promise<APIResponse> {
    return this.put(`/users/${userId}`, payload);
  }

  public deleteUser(userId: number): Promise<APIResponse> {
    return this.delete(`/users/${userId}`);
  }
}
