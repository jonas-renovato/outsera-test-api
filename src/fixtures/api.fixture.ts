import { test as base } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { UsersClient } from '../clients/users.client';

type ApiFixtures = {
  authClient: AuthClient;
  usersClient: UsersClient;
};

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
});

export { expect } from '@playwright/test';
