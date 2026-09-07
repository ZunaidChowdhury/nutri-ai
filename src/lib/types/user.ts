export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  dietaryPreferences?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserResponse {
  success: boolean;
  data: User;
}