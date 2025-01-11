import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/login`;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string){
    const body: LoginRequest = {username, password};
    return this.http.post<any>(this.apiUrl, body);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']).then();
  }

  isAuthenticated() {
    return !!sessionStorage.getItem(environment.TOKEN_NAME);
  }

}
