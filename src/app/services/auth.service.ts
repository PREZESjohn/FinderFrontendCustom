import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserCredentials} from '../domain/UserCredentials';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  authUrl = 'http://localhost:8080/api/v1/auth/login';
  registerUrl = 'http://localhost:8080/api/v1/auth/new-account';
  setupKeyUrl = 'http://localhost:8080/api/v1/auth/key';

  constructor(private http: HttpClient) {
  }

  login(login: string, password: string): Observable<any> {

    const userCredentials = new UserCredentials();
    userCredentials.username = login;
    userCredentials.password = password;

    return this.http.post<TokenResponse>(`${this.authUrl}`, userCredentials);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('key');
  }

  getToken(): any {
    return sessionStorage.getItem('token');
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  setPasswordKeyStorage() {
    sessionStorage.setItem('key', 'true');
  }

  getPasswordKeyStorage(): any {
    return sessionStorage.getItem('key');
  }

  flushPasswordKeyStorage(): void {
    return sessionStorage.removeItem('key');
  }

  register(username: string,email:string, password: string): Observable<any> {
    return this.http.post<TokenResponse>(this.registerUrl, {username,email, password});
  }

  setPasswordKey(passwordKey: string): Observable<any> {
    return this.http.post<TokenResponse>(this.setupKeyUrl, {passwordKey});
  }

  checkIfAdmin(){
      const token = this.getToken();
    let jwtData = token.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)

    let isAdmin = decodedJwtData.role

    // console.log('jwtData: ' + jwtData)
    // console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
    // console.log('decodedJwtData: ' + decodedJwtData)
    // console.log('Is admin: ' + isAdmin)
    return isAdmin == 'ROLE_ADMIN';

  }

  confirmDelete(token:string){
    return this.http.get("http://localhost:8080/api/v1/auth/deleteAccountConfirm?token="+token)
  }

}

interface TokenResponse {
  token: string
}

