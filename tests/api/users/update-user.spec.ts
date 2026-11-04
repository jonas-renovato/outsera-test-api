import type { APIResponse } from '@playwright/test';
import type {
  ApiErrorResponse,
  UpdateUserResponse,
} from '../../../src/contracts/users.contract';
import { usersData } from '../../../src/data/users.data';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectJsonResponse } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

async function expectUpdatedUser(
  response: APIResponse,
  expectedBody: Record<string, unknown>,
): Promise<UpdateUserResponse> {
  return test.step('Assert - valida a resposta de atualização', async () => {
    expectJsonResponse(response, 200);
    const body = (await response.json()) as UpdateUserResponse;
    expectSchema(body, 'userMutation');

    expect(body).toMatchObject(expectedBody);
    return body;
  });
}

test.describe('PUT /users/:id', () => {
  test('deve atualizar um usuário existente', async ({ usersClient }) => {
    const userId = usersData.existingUserId;
    const payload = usersData.validCreatePayload;

    const response = await usersClient.updateUser(userId, payload);

    const body = await expectUpdatedUser(response, payload);
    expect(body.id).toBe(userId);
  });

  test('deve retornar 404 ao atualizar um usuário inexistente', async ({ usersClient }) => {
    const { nonexistentUserId, nonexistentUserMessage, partialCreatePayload } = usersData;

    const response = await usersClient.updateUser(nonexistentUserId, partialCreatePayload);

    // Assert: confirma que a API informa corretamente a ausência do recurso.
    expectJsonResponse(response, 404);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toBe(nonexistentUserMessage);
  });

  test('deve manter os dados ao atualizar com payload vazio', async ({ usersClient }) => {
    const { existingUser, existingUserId, emptyPayload } = usersData;

    const response = await usersClient.updateUser(existingUserId, emptyPayload);

    // Assert: a DummyJSON aceita o payload vazio e retorna os dados originais.
    const body = await expectUpdatedUser(response, emptyPayload);
    expect(body).toMatchObject(existingUser);
  });

  test('deve aceitar tipos incompatíveis conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    const { existingUserId, invalidPayload } = usersData;

    const response = await usersClient.updateUser(existingUserId, invalidPayload);

    // Assert: a DummyJSON não valida os tipos e ecoa os valores recebidos.
    const body = await expectUpdatedUser(response, invalidPayload);
    expect(body.id).toBe(existingUserId);
  });
});
