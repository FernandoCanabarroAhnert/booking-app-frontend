import { jwtDecode } from "jwt-decode";

function obtainRolesFromToken(): string[] {
  const token = localStorage.getItem('access-token');
  const decodedToken: any = jwtDecode(token as string);
  return decodedToken.authorities as string[];
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('access-token');
  return token ? true : false;
}

export function isAdmin(): boolean {
  return obtainRolesFromToken().includes('ROLE_ADMIN');
}

export function isOnlyOperator(): boolean {
  return obtainRolesFromToken().includes('ROLE_OPERATOR') && !obtainRolesFromToken().includes('ROLE_ADMIN');
}