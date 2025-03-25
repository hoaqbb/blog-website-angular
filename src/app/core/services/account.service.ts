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
    return this.http.post<User>(this.baseUrl + "/api/Account/login", model, { withCredentials: true }).pipe(
      tap((res: User) => {
        this.currentUser.set(res);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "/api/Account/register", model, { withCredentials: true }).pipe(
      tap((res: User) => {
        this.currentUser.set(res);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  signInWithGoogle(token: string) {
    return this.http.post<User>(this.baseUrl + "/api/Account/login-with-google", {token: token}, { withCredentials: true }).pipe(
      tap((res: User) => {
        this.currentUser.set(res);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }
  
}
