import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, EMPTY, Observable, retry, tap, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment.development';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(retry(environment.HTTP_RETRY))
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.error === true && event.body.errorMessage) {
            throw new Error(event.body.errorMessage);
          }
        }
      }))
      .pipe(catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (err.error) {
          errorMessage = err.error.message || errorMessage;
        }

        switch (err.status) {
          case 400:
            this._snackBar.open(`Bad Request: ${errorMessage}`, 'ERROR 400', { duration: 5000 });
            break;
          case 401:
            this._snackBar.open(`Unauthorized: ${errorMessage}`, 'ERROR 401', { duration: 5000 });
            // this.router.navigate(['/login']).then();
            break;
          case 403:
            this._snackBar.open(`Forbidden: ${errorMessage}`, 'ERROR 403', { duration: 5000 });
            break;
          case 404:
            this._snackBar.open(`Not Found: ${errorMessage}`, 'ERROR 404', { duration: 5000 });
            break;
          case 409:
            this._snackBar.open(`Conflict: ${errorMessage}`, 'ERROR 409', { duration: 5000 });
            break;
          case 422:
            this._snackBar.open(`Unprocessable Entity: ${errorMessage}`, 'ERROR 422', { duration: 5000 });
            break;
          case 429:
            this._snackBar.open(`Too Many Requests: ${errorMessage}`, 'ERROR 429', { duration: 5000 });
            break;
          case 500:
            this._snackBar.open(`Internal Server Error: ${errorMessage}`, 'ERROR 500', { duration: 5000 });
            break;
          case 503:
            this._snackBar.open(`Service Unavailable: ${errorMessage}`, 'ERROR 503', { duration: 5000 });
            break;
          default:
            this._snackBar.open(`Error: ${errorMessage}`, 'ERROR', { duration: 5000 });
            break;
        }

        // Return EMPTY observable to complete the observable stream
        return EMPTY;
      }))
  }
}
