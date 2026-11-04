import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { LoginRequest } from '../contracts/login.contract';
import { BaseClient } from './base.client';

export class AuthClient extends BaseClient {
  public constructor(request: APIRequestContext) {
    super(request);
  }

  public login(payload: LoginRequest): Promise<APIResponse> {
    return this.post('/auth/login', payload);
  }
}
