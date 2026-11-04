import type { APIResponse } from '@playwright/test';
import type {
  LoginErrorResponse,
  LoginSuccessResponse,
} from '../../../src/contracts/login.contract';
import { authData } from '../../../src/data/auth.data';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectJsonResponse } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

async function expectLoginError(response: APIResponse): Promise<void> {
  await test.step('Assert - valida a resposta de erro do login', async () => {
    // Confirma que o payload incompleto é reportado como requisição inválida em JSON.
    expectJsonResponse(response, 400);

    // Valida o contrato e a mensagem retornada pela DummyJSON.
    const body = (await response.json()) as LoginErrorResponse;
    expectSchema(body, 'loginError');
    expect(body.message).toBe(authData.missingCredentialsMessage);
  });
}

test.describe('POST /auth/login', () => {
  test('deve autenticar com credenciais válidas', async ({ authClient }) => {
    // Arrange: usa as credenciais de demonstração válidas da DummyJSON.
    const credentials = authData.validCredentials;

    const response = await authClient.login(credentials);

    await test.step('Assert - valida a resposta de login bem-sucedido', async () => {
      expectJsonResponse(response, 200);
      const body = (await response.json()) as LoginSuccessResponse;
      expectSchema(body, 'loginSuccess');

      expect(body.username).toBe(credentials.username);
    });
  });

  test('deve retornar erro ao autenticar sem senha', async ({ authClient }) => {
    const credentials = authData.missingPasswordCredentials;

    const response = await authClient.login(credentials);

    await expectLoginError(response);
  });

  test('deve retornar erro ao autenticar sem username', async ({ authClient }) => {
    const credentials = authData.missingUsernameCredentials;

    const response = await authClient.login(credentials);

    // Assert: a DummyJSON retorna a mesma mensagem para ausência de username ou password.
    await expectLoginError(response);
  });

  test('deve retornar erro ao autenticar com payload vazio', async ({ authClient }) => {
    const credentials = authData.emptyCredentials;

    const response = await authClient.login(credentials);

    await expectLoginError(response);
  });
});
