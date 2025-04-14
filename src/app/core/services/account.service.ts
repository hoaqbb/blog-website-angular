import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "/api/Account/login", model).pipe(
      tap((res: User) => this.setCurrentUserSource(res))
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "/api/Account/register", model).pipe(
      tap((res: User) => this.setCurrentUserSource(res))
    );
  }

  signInWithGoogle(token: string) {
    return this.http.post<User>(this.baseUrl + "/api/Account/login-with-google", {token: token}).pipe(
      tap((res: User) => this.setCurrentUserSource(res))
    );
  }

  logout() {
    return this.http.post(this.baseUrl + "/api/Token/revoke", {}).pipe(
      tap(() => {
        this.removeCurrentUserSource();
      }
    ));
  }
  
  refreshToken() {
    return this.http.post(this.baseUrl + "/api/Token/refresh-token", {})
  }

  setCurrentUserSource(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeCurrentUserSource() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }
}
