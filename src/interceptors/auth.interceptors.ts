import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken(); // Get stored token from AuthService

  // If token exists, clone the request with Authorization header
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(authReq.url, 'returned a response with status', event.status);

        if (event.status === 401 || event.status === 403) {
          authService.logout(); // Clears storage + redirects
        }
      }
    })
  );
}