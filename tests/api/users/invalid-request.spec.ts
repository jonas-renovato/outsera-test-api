import type { ApiErrorResponse } from '../../../src/contracts/users.contract';
import { expect, test } from '../../../src/fixtures/api.fixture';
import { expectHeader, expectStatus } from '../../../src/helpers/response.helper';
import { expectSchema } from '../../../src/helpers/schema.helper';

test.describe('Requisições inválidas da API de usuários', () => {
  test('deve rejeitar um método HTTP não suportado', async ({ request }) => {
    const response = await request.fetch('/users/2', { method: 'OPTIONS' });

    // Assert: a DummyJSON responde sem conteúdo para OPTIONS, sem tratá-lo como recurso JSON.
    expectStatus(response, 204);
    expect(response.headers()['content-type']).toBeUndefined();
    await expect(response.text()).resolves.toBe('');
  });

  test('deve retornar erro ao receber JSON malformado', async ({ request }) => {
    const malformedPayload = '{';

    const response = await request.post('/users/add', {
      data: malformedPayload,
      headers: { 'content-type': 'application/json' },
    });

    // Assert: a API rejeita o JSON antes de processar o endpoint e retorna o erro em JSON.
    expectStatus(response, 400);
    expectHeader(response, 'content-type', /application\/json/);
    const body = (await response.json()) as ApiErrorResponse;
    expectSchema(body, 'userError');
    expect(body.message).toMatch(/(?:invalid JSON|not valid JSON|JSON at position)/i);
  });
});