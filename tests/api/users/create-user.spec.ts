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
    // Confirma sucesso HTTP, conteúdo JSON e o contrato da resposta de criação.
    expectJsonResponse(response, 201);
    const body = (await response.json()) as CreateUserResponse;
    expectSchema(body, 'userMutation');

    // Valida que os campos enviados foram preservados na resposta.
    expect(body).toMatchObject(expectedBody);
    return body;
  });
}

test.describe('POST /users/add', () => {
  test('deve criar um usuário com payload válido', async ({ usersClient }) => {
    // Arrange: define uma massa válida para criação de usuário.
    const payload = usersData.validCreatePayload;

    // Act: envia o payload ao endpoint de criação.
    const response = await usersClient.createUser(payload);

    // Assert: valida o recurso criado e o contrato HTTP.
    await expectCreatedUser(response, payload);
  });

  test('deve criar um usuário com payload vazio conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    // Arrange: define um payload sem campos de usuário.
    const payload = usersData.emptyPayload;

    // Act: envia o objeto vazio ao endpoint de criação.
    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON aceita o payload e preenche campos com valores padrão.
    const body = await expectCreatedUser(response, payload);
    expect(body).toMatchObject(usersData.defaultUserValues);
  });

  test('deve criar um usuário sem lastName conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    // Arrange: omite o campo lastName do payload de criação.
    const payload = usersData.partialCreatePayload;

    // Act: envia o payload parcial para a API.
    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON aceita o campo ausente e preenche lastName com valor padrão.
    const body = await expectCreatedUser(response, payload);
    expect(body.lastName).toBe(usersData.defaultUserValues.lastName);
  });

  test('deve aceitar tipos incompatíveis conforme comportamento da DummyJSON', async ({
    usersClient,
  }) => {
    // Arrange: usa tipos incompatíveis com o contrato de domínio esperado.
    const payload = usersData.invalidPayload;

    // Act: envia o payload malformado sem normalizá-lo no client.
    const response = await usersClient.createUser(payload);

    // Assert: a DummyJSON não valida os tipos e ecoa os valores recebidos.
    await expectCreatedUser(response, payload);
  });
});
