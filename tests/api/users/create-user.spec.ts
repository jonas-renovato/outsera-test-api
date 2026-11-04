import type { APIResponse } from '@playwright/test';
import type { CreateUserResponse } from '../../../src/contracts/users.contract';
import { usersData } from '../../../src/data/users.data';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectJsonResponse } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

async function expectCreatedUser(
  response: APIResponse,
  expectedBody: Record<string, unknown>,
): Promise<CreateUserResponse> {
  return test.step('Assert - valida a resposta de criação', async () => {
    expectJsonResponse(response, 201);
    const body = (await response.json()) as CreateUserResponse;
    expectSchema(body, 'userMutation');

    expect(body).toMatchObject(expectedBody);
    return body;
  });
}

test.describe('POST /users/add', () => {
  test('deve criar um usuário com payload válido', async ({ usersClient }) => {
    const payload = usersData.validCreatePayload;

    const response = await usersClient.createUser(payload);

    await expectCreatedUser(response, payload);
  });

  test('deve criar um usuário com payload vazio conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    const payload = usersData.emptyPayload;

    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON aceita o payload e preenche campos com valores padrão.
    const body = await expectCreatedUser(response, payload);
    expect(body).toMatchObject(usersData.defaultUserValues);
  });

  test('deve criar um usuário sem lastName conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    const payload = usersData.partialCreatePayload;

    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON aceita o campo ausente e preenche lastName com valor padrão.
    const body = await expectCreatedUser(response, payload);
    expect(body.lastName).toBe(usersData.defaultUserValues.lastName);
  });

  test('deve aceitar tipos incompatíveis conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    const payload = usersData.invalidPayload;

    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON não valida os tipos e ecoa os valores recebidos.
    await expectCreatedUser(response, payload);
  });
});
