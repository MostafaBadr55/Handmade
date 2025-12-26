export interface LoginRequest {
  userName: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  userName: string;
  password?: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  userName: string;
  phoneNumber: string;
  isSeller: boolean;
  isActive: boolean;
}

export interface SelectRoleRequest {
  role: number;
}

export interface SelectRoleResponse {
  message: string;
  role: string;
  redirectTo?: string;
  requiresShopCreation?: boolean;
}
