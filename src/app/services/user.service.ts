import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../domain/User';
import {Observable} from 'rxjs';
import {PasswordChangeDto} from '../domain/dto/PasswordChangeDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  changePasswordUrl = 'http://localhost:8080/api/auth/password-change';
  editUserUrl = 'http://localhost:8080/api/v1/users/edit'
  baseURL = 'http://localhost:8080/api/v1/users'
  constructor(private http: HttpClient) {
  }

  changePassword(passwordChange: PasswordChangeDto): Observable<any> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(passwordChange);
    console.log(body)
    return this.http.post(this.changePasswordUrl, body, {headers})
  }

  editUser(user:User): Observable<any>{
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(user);
  return this.http.put(this.editUserUrl,body,{headers});
  }

  getUser():Observable<User>{
    return this.http.get<User>(this.baseURL)
  }

  getUserGroups() {
    return this.http.get<User>(this.baseURL+'/my-groups')
  }

  joinGroup(groupId:number){
    return this.http.patch<User>(this.baseURL + '/joinGroup/' + groupId,{},{ observe: 'response' });
  }

  leaveGroup(groupId: number) {
    const url = this.baseURL + '/my-groups/' + groupId;

    return this.http.delete(url);
  }

  getProfile(userId:number){
    return this.http.get(this.baseURL+'/profile/'+userId)
  }

  uploadProfilePicture(file):Observable<any>{
    const formData = new FormData();
    formData.append('profilePicture',file,file.name);
    return this.http.patch(this.baseURL+'/profilePicture',formData)
  }
  getProfilePicture(userId:number):Observable<any>{
    return this.http.get(this.baseURL+'/profilePicture/'+userId,{responseType: 'blob'});
  }
}

