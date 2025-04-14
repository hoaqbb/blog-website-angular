import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const route = inject(Router);

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Try to refresh the token
        return accountService.refreshToken().pipe(
          // Switch to retrying the original request after successful token refresh
          switchMap(() => {
            // Create a new request with the same configuration as the original
            return next(req.clone({ withCredentials: true }));
          }),
          // Handle errors during token refresh
          catchError((refreshError) => {
            console.error('Error refreshing token:', refreshError);
            // Logout the user and redirect to login page
            accountService.removeCurrentUserSource();
            route.navigateByUrl('/login');
            return throwError(
              () => new Error('Session expired. Please login again.')
            );
          })
        );
      }

      return throwError(() => error);
    })
  );
};
