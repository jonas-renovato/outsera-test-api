# API Test Automation

Framework de automação de APIs com Playwright, TypeScript, AJV e a API pública
[DummyJSON](https://dummyjson.com). A estrutura separa acesso HTTP, massas,
contratos, schemas e asserções para permitir a evolução independente de cada
camada.

## Tecnologias

- [Playwright Test](https://playwright.dev): runner, requests HTTP, fixtures e relatórios.
- [TypeScript](https://www.typescriptlang.org): tipagem estática.
- [AJV](https://ajv.js.org): validação dos contratos JSON Schema.
- [DummyJSON](https://dummyjson.com): API pública utilizada nos testes de integração.

## Arquitetura

```text
.
├── src/
│   ├── clients/
│   │   ├── base.client.ts       # Abstrai verbos HTTP compartilhados
│   │   ├── auth.client.ts       # Operações do domínio de autenticação
│   │   └── users.client.ts      # Operações do domínio de usuários
│   ├── config/
│   │   └── environment.ts       # Seleção centralizada de ambiente
│   ├── contracts/
│   │   ├── login.contract.ts    # Tipos TypeScript de autenticação
│   │   └── users.contract.ts    # Tipos TypeScript de usuários
│   ├── data/
│   │   ├── auth.data.ts         # Credenciais, payloads e mensagens de auth
│   │   └── users.data.ts        # IDs, payloads e dados esperados de usuários
│   ├── fixtures/
│   │   └── api.fixture.ts       # Injeta clients tipados nos testes
│   ├── helpers/
│   │   ├── response.helper.ts   # Asserções HTTP e de corpo reutilizáveis
│   │   └── schema.helper.ts     # Validação centralizada de JSON Schema por AJV
│   └── schemas/
│       ├── login.schema.json    # Contratos JSON de login
│       └── users.schema.json    # Contratos JSON de usuários
├── tests/
│   └── api/
│       ├── auth/
│       │   └── login.spec.ts
│       └── users/
│           ├── create-user.spec.ts
│           ├── delete-user.spec.ts
│           ├── get-user.spec.ts
│           └── update-user.spec.ts
├── playwright.config.ts
└── tsconfig.json
```

### Responsabilidades

- **Clients:** aplicam o princípio de responsabilidade única: cada client
  conhece apenas os endpoints do seu domínio. `BaseClient` evita duplicar a
  implementação dos verbos HTTP.
- **Contracts:** fornecem tipagem de requests e responses sem acoplar os testes
  à implementação do client.
- **Schemas:** são contratos portáveis e independentes da linguagem. O AJV os
  aplica aos corpos das respostas antes das asserções de negócio.
- **Data:** concentra IDs, payloads e mensagens esperadas; specs não mantêm
  massas hardcoded.
- **Fixtures:** compõem dependências de teste e expõem `authClient` e
  `usersClient`, sem criar clients manualmente em cada spec.
- **Helpers:** consolidam asserções de protocolo e contrato, reduzindo
  repetição e garantindo mensagens de falha consistentes.
- **Specs:** descrevem apenas Arrange, Act e Assert do cenário.

## Cenários cobertos

Atualmente a suíte possui **18 cenários**:

| Domínio | Endpoint | Cobertura |
|---|---|---|
| Autenticação | `POST /auth/login` | Login válido; username, senha ou payload ausentes |
| Usuários | `GET /users/:id` e `GET /users` | Usuário existente, inexistente, ID inválido e coleção |
| Usuários | `POST /users/add` | Payload válido, vazio, parcial e com tipos incompatíveis |
| Usuários | `PUT /users/:id` | Atualização válida, recurso inexistente, payload vazio e tipos incompatíveis |
| Usuários | `DELETE /users/:id` | Exclusão existente e recurso inexistente |

Todos validam status code, `content-type`, corpo e o schema correspondente.
As mutações são simuladas pela DummyJSON; os testes validam o comportamento
documentado da API, sem assumir persistência entre execuções.

## Execução

### Pré-requisitos

- Node.js 20 ou superior
- npm

```bash
npm install
npm run typecheck
npm test
```

O ambiente padrão é `dev`. Para selecionar outro ambiente:

```bash
TEST_ENV=staging npm test
```

## Relatórios

Os reporters `list` e `html` são configurados no
[playwright.config.ts](./playwright.config.ts). Após uma execução:

```bash
npm run test:report
```

O relatório HTML é gerado em `playwright-report/`, e artefatos de falha ficam
em `test-results/`. Ambos são ignorados pelo Git.

## Adicionando um novo domínio

1. Crie `<dominio>.client.ts` estendendo `BaseClient`.
2. Exponha o novo client em `api.fixture.ts`.
3. Crie os tipos em `src/contracts/`, os schemas em `src/schemas/` e os dados
   em `src/data/`.
4. Adicione nomes de schema em `SchemaName` e no mapa de `schema.helper.ts`.
5. Organize os specs por domínio em `tests/api/<dominio>/`.
