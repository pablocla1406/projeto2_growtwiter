import { UserResponse } from "./IUser";

export interface LoginData {
  login: string;
  password: string;
}


export interface AuthResponse {
  user: UserResponse;
  token: string;
}