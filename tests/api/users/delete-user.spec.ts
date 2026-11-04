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
    // Confirma sucesso HTTP, conteúdo JSON e o contrato da exclusão simulada.
    expectJsonResponse(response, 200);
    const body = (await response.json()) as DeleteUserResponse;
    expectSchema(body, 'deletedUser');

    // Valida o identificador e o marcador de exclusão retornados.
    expect(body.id).toBe(userId);
    return body;
  });
}

test.describe('DELETE /users/:id', () => {
  test('deve excluir um usuário existente', async ({ usersClient }) => {
    // Arrange: seleciona um usuário existente da massa pública.
    const userId = usersData.existingUserId;

    // Act: solicita a exclusão do usuário.
    const response = await usersClient.deleteUser(userId);

    // Assert: valida o marcador de exclusão e o contrato HTTP.
    await expectDeletedUser(response, userId);
  });

  test('deve retornar 404 ao excluir um usuário inexistente', async ({ usersClient }) => {
    // Arrange: define um ID que não existe na massa pública da DummyJSON.
    const { nonexistentUserId, nonexistentUserMessage } = usersData;

    // Act: solicita a exclusão de um recurso inexistente.
    const response = await usersClient.deleteUser(nonexistentUserId);

    // Assert: confirma que a API informa corretamente a ausência do recurso.
    expectJsonResponse(response, 404);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toBe(nonexistentUserMessage);
  });
});
