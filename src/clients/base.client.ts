import type { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseClient {
  protected constructor(protected readonly request: APIRequestContext) {}

  protected get(path: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(path, { params });
  }

  protected post(path: string, data: object): Promise<APIResponse> {
    return this.request.post(path, { data });
  }

  protected put(path: string, data: object): Promise<APIResponse> {
    return this.request.put(path, { data });
  }

  protected delete(path: string): Promise<APIResponse> {
    return this.request.delete(path);
  }
}
