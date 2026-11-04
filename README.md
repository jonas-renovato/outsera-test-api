# API Test Automation

## Objetivo

Projeto desenvolvido como parte de uma avaliação técnica de QA Automation, com foco em:

- Automação de testes de API
- Validação de contratos utilizando JSON Schema
- Organização em camadas e reutilização de componentes
- Qualidade de código com TypeScript
- Integração contínua utilizando GitHub Actions
- Cobertura de cenários positivos e negativos

A solução utiliza Playwright, TypeScript e AJV para validar operações de autenticação e CRUD através de uma arquitetura escalável e de fácil manutenção.


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

## Estatísticas da suíte

| Métrica | Valor |
|----------|----------|
| Cenários automatizados | 18 |
| Endpoints cobertos | 5 |
| Métodos HTTP | GET, POST, PUT, DELETE |
| Domínios | Autenticação e Usuários |
| Validação de Schema | Sim |
| CI/CD | GitHub Actions |
| Framework | Playwright |
| Linguagem | TypeScript |

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

## CI/CD

O workflow [ci-cd.yml](./.github/workflows/ci-cd.yml) executa automaticamente
em `push` e `pull_request` destinados às branches `main` e `develop`.

### Etapas do pipeline

1. **Quality Gate:** faz checkout, configura a versão LTS do Node.js, restaura
   o cache de npm, instala dependências com `npm ci` e executa
   `npm run typecheck`; qualquer erro TypeScript
   bloqueia os testes.
2. **API Tests:** em um runner limpo, restaura dependências, instala
   explicitamente o runtime do Playwright com
   `npx playwright install --with-deps` e executa `npm test`, incluindo os
   reporters `list` e HTML.
3. **Publish Test Results:** publica os artifacts `playwright-report` e
   `test-results`, inclusive quando uma asserção falha.

Não há um job de Setup separado: jobs do GitHub Actions são isolados e o antigo
Setup não transferia `node_modules` nem outro artifact reutilizável. Manter a
preparação em cada job consumidor preserva isolamento e reprodutibilidade; o
cache nativo de npm evita downloads desnecessários.

Embora a suíte atual seja de API, a instalação explícita do Playwright garante
que o runtime e suas dependências de sistema correspondam à versão bloqueada
no projeto. Isso mantém o job pronto para traces e para uma futura expansão de
testes Web E2E sem alterar sua preparação.

```text
Push / Pull Request (main ou develop)
        ↓
Quality Gate: TypeScript typecheck
        ↓
API Tests: Playwright API suite
        ↓
Generate HTML Report
        ↓
Publish Artifacts
```

### Acessando e interpretando artifacts

Na página da execução em **Actions**, abra a seção **Artifacts** ao final do
workflow e baixe:

- **`playwright-report`**: extraia o arquivo e abra `index.html` no navegador
  para consultar cada teste, etapa, duração e falha.
- **`test-results`**: contém contexto de falha, traces e demais evidências
  configuradas pelo Playwright.

Um job vermelho em **Quality Gate** indica uma falha de tipagem. Um job vermelho
em **API Tests** indica uma falha de cenário; os artifacts devem ser usados
para investigar a resposta e o trace correspondente.

### Evolução para Web E2E e Mobile

O workflow pode crescer sem alterar o pipeline de API: adicione jobs
independentes, como `web-e2e-tests` e `mobile-tests`, após o Quality Gate.
Esses jobs podem instalar browsers ou emuladores próprios, usar projects
Playwright distintos e publicar artifacts com nomes específicos, por exemplo
`web-playwright-report` e `mobile-test-results`.

## Adicionando um novo domínio

1. Crie `<dominio>.client.ts` estendendo `BaseClient`.
2. Exponha o novo client em `api.fixture.ts`.
3. Crie os tipos em `src/contracts/`, os schemas em `src/schemas/` e os dados
   em `src/data/`.
4. Adicione nomes de schema em `SchemaName` e no mapa de `schema.helper.ts`.
5. Organize os specs por domínio em `tests/api/<dominio>/`.
