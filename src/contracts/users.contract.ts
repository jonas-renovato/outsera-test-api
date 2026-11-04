export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserRequest {
  firstName?: string;
  lastName?: string;
  age?: number;
}

export interface CreateUserResponse {
  id: number;
  [field: string]: unknown;
}

export type UpdateUserRequest = CreateUserRequest;

export interface UpdateUserResponse {
  id: number;
  [field: string]: unknown;
}

export interface DeleteUserResponse {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}

export interface ApiErrorResponse {
  message: string;
}
