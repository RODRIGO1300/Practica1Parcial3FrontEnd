import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  LoginUsuarioRequest,
  RegistroUsuarioRequest,
} from '../interfaces/auth-request.interfaces';
import { environment } from '../../environments/envirnoments';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { timeout } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.BASE_URL + 'auth/';
  private readonly usuariosUrl = environment.BASE_URL + 'usuarios/';
  private readonly tokenKey = 'token';
  public readonly isAuthenticated = signal(this.hasToken());

  login(objeto: LoginUsuarioRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}login`, objeto)
      .pipe(timeout(10000));
  }

  register(objeto: RegistroUsuarioRequest): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.usuariosUrl}create`, objeto)
      .pipe(timeout(10000));
  }

  saveToken(token: string): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  hasToken(): boolean {
    if (!this.canUseLocalStorage()) {
      return false;
    }

    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    if (!this.canUseLocalStorage()) {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }

  private canUseLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
