import type { ApiErrorResponse, User, UsersListResponse } from '../../../src/contracts/users.contract';
import { usersData } from '../../../src/data/users.data';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectJsonResponse } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

test.describe('GET /users/:id', () => {
  test('deve retornar os dados do usuário de ID 2', async ({ usersClient }) => {
    // Arrange: define a massa conhecida disponibilizada pela DummyJSON.
    const { existingUser, existingUserId } = usersData;

    // Act: consulta o recurso pelo client de usuários.
    const response = await usersClient.getUser(existingUserId);

    // Assert: valida sucesso HTTP, contrato e os dados estáveis do usuário.
    expectJsonResponse(response, 200);
    const body = (await response.json()) as User;
    expectSchema(body, 'user');
    expect(body).toMatchObject(existingUser);
  });

  test('deve retornar 404 para um usuário inexistente', async ({ usersClient }) => {
    // Arrange: define um ID fora da massa pública disponibilizada pela DummyJSON.
    const { nonexistentUserId, nonexistentUserMessage } = usersData;

    // Act: consulta um recurso que não existe.
    const response = await usersClient.getUser(nonexistentUserId);

    // Assert: valida o contrato e a mensagem de recurso não encontrado.
    expectJsonResponse(response, 404);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toBe(nonexistentUserMessage);
  });

  test('deve retornar 400 para um ID não numérico', async ({ usersClient }) => {
    // Arrange: define um identificador inválido para o recurso de usuários.
    const { invalidUserId, invalidUserIdMessage } = usersData;

    // Act: envia o identificador inválido sem tratá-lo localmente.
    const response = await usersClient.getUser(invalidUserId);

    // Assert: a DummyJSON valida o formato do ID e retorna o contrato de erro.
    expectJsonResponse(response, 400);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toBe(invalidUserIdMessage);
  });

  test('deve retornar a coleção de usuários quando o ID não é informado', async ({
    usersClient,
  }) => {
    // Arrange: não informa um identificador de recurso para chamar /users.

    // Act: solicita a rota de coleção.
    const response = await usersClient.getUsers();

    // Assert: valida sucesso HTTP, contrato e a existência de usuários.
    expectJsonResponse(response, 200);
    const body = (await response.json()) as UsersListResponse;
    expectSchema(body, 'usersList');
    expect(body.users.length).toBeGreaterThan(0);
  });
});
