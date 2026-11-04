import 'dotenv/config';

export type EnvironmentName = 'dev' | 'staging';

interface EnvironmentConfig {
  baseUrl: string;
}

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://dummyjson.com',
  },
  staging: {
    baseUrl: 'https://dummyjson.com',
  },
};

const requestedEnvironment = process.env.TEST_ENV ?? 'dev';

if (!(requestedEnvironment in environments)) {
  throw new Error(
    `Unsupported TEST_ENV "${requestedEnvironment}". Use one of: ${Object.keys(environments).join(', ')}.`,
  );
}

export const environment = {
  ...environments[requestedEnvironment as EnvironmentName],
  name: requestedEnvironment as EnvironmentName,
};
