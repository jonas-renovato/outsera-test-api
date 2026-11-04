import { expect, type APIResponse } from '@playwright/test';

export function expectStatus(response: APIResponse, expectedStatus: number): void {
  expect(response.status()).toBe(expectedStatus);
}

export function expectHeader(
  response: APIResponse,
  headerName: string,
  expectedValue: string | RegExp,
): void {
  const headerValue = response.headers()[headerName.toLowerCase()];

  expect(headerValue, `Expected response header "${headerName}" to be present`).toBeDefined();

  if (typeof expectedValue === 'string') {
    expect(headerValue).toBe(expectedValue);
    return;
  }

  expect(headerValue).toMatch(expectedValue);
}

export async function expectBodyToContain(
  response: APIResponse,
  expectedBody: Record<string, unknown>,
): Promise<void> {
  await expect(response.json()).resolves.toMatchObject(expectedBody);
}

export function expectJsonResponse(response: APIResponse, expectedStatus: number): void {
  expectStatus(response, expectedStatus);
  expectHeader(response, 'content-type', /application\/json/);
}
