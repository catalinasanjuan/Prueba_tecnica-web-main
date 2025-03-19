export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}