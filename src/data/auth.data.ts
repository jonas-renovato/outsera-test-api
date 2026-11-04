import type { LoginRequest } from '../contracts/login.contract';

export const authData = {
  validCredentials: {
    username: 'emilys',
    password: 'emilyspass',
  } satisfies Required<LoginRequest>,
  missingPasswordCredentials: {
    username: 'emilys',
  } satisfies LoginRequest,
  missingUsernameCredentials: {
    password: 'emilyspass',
  } satisfies LoginRequest,
  emptyCredentials: {} satisfies LoginRequest,
  missingCredentialsMessage: 'Username and password required',
} as const;
