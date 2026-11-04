import type { APIResponse } from '@playwright/test';
import type {
  ApiErrorResponse,
  DeleteUserResponse,
} from '../../../src/contracts/users.contract';
import { usersData } from '../../../src/data/users.data';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectJsonResponse } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

async function expectDeletedUser(
  response: APIResponse,
  userId: number,
): Promise<DeleteUserResponse> {
  return test.step('Assert - valida a resposta de exclusão', async () => {
    expectJsonResponse(response, 200);
    const body = (await response.json()) as DeleteUserResponse;
    expectSchema(body, 'deletedUser');

    expect(body.id).toBe(userId);
    return body;
  });
}

test.describe('DELETE /users/:id', () => {
  test('deve excluir um usuário existente', async ({ usersClient }) => {
    const userId = usersData.existingUserId;

    const response = await usersClient.deleteUser(userId);

    await expectDeletedUser(response, userId);
  });

  test('deve retornar 404 ao excluir um usuário inexistente', async ({ usersClient }) => {
    // Arrange: define um ID que não existe na massa pública da DummyJSON.
    const { nonexistentUserId, nonexistentUserMessage } = usersData;

    const response = await usersClient.deleteUser(nonexistentUserId);

    // Assert: confirma que a API informa corretamente a ausência do recurso.
    expectJsonResponse(response, 404);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toBe(nonexistentUserMessage);
  });
});
