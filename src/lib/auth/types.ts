export type Role = 'ADMIN' | 'ANALYST' | 'SUPERVISOR' | 'INVESTIGATOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
}

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
