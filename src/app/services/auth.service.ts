import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserCredentials} from '../domain/UserCredentials';
import {from, Observable} from 'rxjs';
import {EmailDto} from '../domain/dto/EmailDto';
import {Router} from "@angular/router";
@Injectable({providedIn: 'root'})
export class AuthService {

  baseUrl = 'http://localhost:8080/api/v1/auth';
  authUrl = 'http://localhost:8080/api/v1/auth/login';
  registerUrl = 'http://localhost:8080/api/v1/auth/new-account';
  tryUrl = 'http://localhost:8080/api/v1/users/all';

  constructor(private http: HttpClient, private route: Router) {
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

  getPasswordKeyStorage(): any {
    return sessionStorage.getItem('key');
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<TokenResponse>(this.registerUrl, {username, email, password});
  }

  checkIfTokenCorrect() {
    let check = true
      this.http.get(this.tryUrl).subscribe(data => {
        check = true
      }, () => {
        check = false
        this.logout()
        this.route.navigate(['/login'])
      })
      return check
  }

  checkIfAdmin() {
    const token = this.getToken();
    let jwtData = token.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)

    let isAdmin = decodedJwtData.role

    return isAdmin == 'ROLE_ADMIN';

  }

  checkToken() {
    if (this.getToken()) {
      const token = this.getToken();
      try {
        let jwtData = token.split('.')[1]
        let decodedJwtJsonData = window.atob(jwtData)
        let decodedJwtData = JSON.parse(decodedJwtJsonData)

        let role = decodedJwtData.role

        return role == 'ROLE_USER' || role == "ROLE_ADMIN";
      } catch (e) {
        this.logout()
        return false;
      }
    } else {
      return false;
    }

  }

  confirmDelete(token: string) {
    return this.http.get(this.baseUrl + "/deleteAccountConfirm?token=" + token)
  }

  confirmRegister(token: string) {
    return this.http.get(this.baseUrl + "/confirmAccountRegister?token=" + token)
  }

  changeEmail(email: EmailDto) {
    return this.http.patch(this.baseUrl + "/emailChange", email)
  }

  confirmEmailChange(token: string) {
    return this.http.get(this.baseUrl + "/confirmEmailChange?token=" + token)
  }


}

interface TokenResponse {
  token: string
}

