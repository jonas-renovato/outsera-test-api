import type { CreateUserRequest } from '../contracts/users.contract';

export const usersData = {
  existingUserId: 2,
  nonexistentUserId: 9999,
  invalidUserId: 'abc',
  existingUser: {
    id: 2,
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael.williams@x.dummyjson.com',
  },
  validCreatePayload: {
    firstName: 'Jonas',
    lastName: 'Silva',
    age: 30,
  } satisfies Required<CreateUserRequest>,
  partialCreatePayload: {
    firstName: 'Jonas',
  } satisfies CreateUserRequest,
  emptyPayload: {} satisfies CreateUserRequest,
  invalidPayload: {
    firstName: 123,
    age: 'wrong',
  },
  nonexistentUserMessage: "User with id '9999' not found",
  invalidUserIdMessage: "Invalid user id 'abc'",
  defaultUserValues: {
    firstName: '',
    lastName: '',
    age: null,
  },
} as const;
