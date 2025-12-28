import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../api/api.tokens';
import { AuthTokenService } from '../api/auth-token.service';
import { AuthResponse, LoginRequest, RegisterRequest, SelectRoleRequest, SelectRoleResponse } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly tokenService = inject(AuthTokenService);

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/api/Auth/register`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    console.log('AuthService.login: using apiBaseUrl =', this.apiBaseUrl);
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/api/Auth/login`, data).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token);
        console.log('AuthService.login: token set, token length=', response.token ? response.token.length : 0);
        this.tokenService.setUserName(response.user.userName);
      })
    );
  }

  checkEmail(email: string): Observable<void> {
    return this.http.get<void>(`${this.apiBaseUrl}/api/Auth/check-email/${email}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBaseUrl}/api/User/roles`);
  }

  selectRole(payload: SelectRoleRequest): Observable<SelectRoleResponse> {
    return this.http.post<SelectRoleResponse>(`${this.apiBaseUrl}/api/User/select-role`, payload);
  }
}
