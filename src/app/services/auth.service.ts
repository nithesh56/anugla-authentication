import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private tokenKey = 'authToken';
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus = this.authStatusSubject.asObservable();
  
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ access_token: string }>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        map(response => {
          if (response && response.access_token) {
            localStorage.setItem(this.tokenKey, response.access_token);
            this.authStatusSubject.next(true);
            return true;
          }
          return false;
        })
      );
  }
  

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    
    return localStorage.getItem(this.tokenKey) || '';
  }
}
