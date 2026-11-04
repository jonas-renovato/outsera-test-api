export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
}

export interface LoginErrorResponse {
  message: string;
}
