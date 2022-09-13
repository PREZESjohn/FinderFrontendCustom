import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../domain/User';
import {PasswordChangeDto} from '../domain/dto/PasswordChangeDto';
import {DomSanitizer} from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import {BannedUserDTO} from '../domain/dto/BannedUserDTO';
import {Report} from '../domain/Report';
import {ReportedUser} from '../domain/ReportedUser';
import {InGameRoles} from '../domain/dto/InGameRoles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  changePasswordUrl = 'http://localhost:8080/api/v1/auth/password-change';
  deleteUserUrl = 'http://localhost:8080/api/v1/auth/delete-user';
  editUserUrl = 'http://localhost:8080/api/v1/users/edit'
  baseURL = 'http://localhost:8080/api/v1/users'
  reportedUsers:ReportedUser[];

  private pictureSubject = new Subject<any>();
  private reportedUsersSubject = new Subject<any>();

  constructor(private http: HttpClient, private sanitizer:DomSanitizer) {
  }

  changePassword(passwordChange: PasswordChangeDto): Observable<any> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(passwordChange);
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
  deleteUser():Observable<any>{
    return this.http.delete(this.deleteUserUrl);
  }
  getUserGroups() {
    return this.http.get<User>(this.baseURL+'/my-groups')
  }
  getUserGroupsByGame(gameId:number){
    return this.http.get<User>(this.baseURL+'/my-groups/'+gameId)
  }

  joinGroup(groupId:number,inGameRole:InGameRoles){
    console.log(inGameRole+"-ROLA")
    return this.http.patch<User>(this.baseURL + '/joinGroup/' + groupId,inGameRole,{ observe: 'response' });
  }


  leaveGroup(groupId: number) {
    const url = this.baseURL + '/my-groups/' + groupId;

    return this.http.delete(url);
  }

  getProfile(userId:number){
    return this.http.get(this.baseURL+'/profile/'+userId)
  }

  uploadProfilePicture(file:any):Observable<any>{
    const formData = new FormData();
    formData.append('profilePicture',file,file.name);
    return this.http.patch(this.baseURL+'/profilePicture',formData)
  }
  getProfilePicture(userId:number):Observable<any>{
    return this.http.get(this.baseURL+'/profilePicture/'+userId,{responseType: 'blob'});
  }
  prepareProfilePicture(data:any){
    if (data.size===0) {
      return '../assets/img/default-avatar.png';
    } else {
      const newImage = URL.createObjectURL(data);
      return this.sanitizer.bypassSecurityTrustUrl(newImage);
    }
  }

  setReportedUsers(reportedUsers){
    this.reportedUsers = reportedUsers;
    this.reportedUsersSubject.next(reportedUsers);
  }

  getReportedUsersFromService(){
    return this.reportedUsers;
  }

  lookForReportUpdate():Observable<any>{
    return this.reportedUsersSubject.asObservable();
  }


  setProfilePicture(data:any){
    console.log(data)
    if (data.size===0) {
      this.pictureSubject.next('../assets/img/default-avatar.png');
      return '../assets/img/default-avatar.png';
    } else {
      const newImage = URL.createObjectURL(data);
      this.pictureSubject.next(this.sanitizer.bypassSecurityTrustUrl(newImage));
      return this.sanitizer.bypassSecurityTrustUrl(newImage);
    }
  }

  observeProfilePictureChange():Observable<any>{
    return this.pictureSubject.asObservable();
  }

  getUserByUsername(username:string){
    return this.http.get(this.baseURL+'/'+username)
  }

  reportUser(report:Report,userId:number){
    return this.http.put(this.baseURL+'/report/'+userId,report)
  }

  getBannedUsers(){
    return this.http.get(this.baseURL+'/banned')
  }

  unbanUser(id:number){
    return this.http.get(this.baseURL+'/unban/'+id)
  }

  banUser(id:number, reason:string){
    return this.http.put(this.baseURL+'/banUser',{id,reason})
  }

  getUserChatLogs(userId:number){
    return this.http.get(this.baseURL+'/chatLogs/'+userId)
  }

  getReportedUsers(){
    return this.http.get(this.baseURL+'/reportedUsers')
  }
  deleteReports(user){
    return this.http.delete(this.baseURL+'/deleteReports/'+user.id)
  }

  sendFriendRequest(user){
    return this.http.post(this.baseURL+'/sendFriendRequest/'+user.id,{})
  }

  getFriendRequests(){
    return this.http.get(this.baseURL+'/loadFriendRequests')
  }

  acceptFriendRequest(requestId:number){
    return this.http.put(this.baseURL+'/acceptFriendRequest/'+requestId,{})
  }
  declineFriendRequest(requestId:number){
    return this.http.put(this.baseURL+'/declineFriendRequest/'+requestId,{})
  }

  getFriends(){
    return this.http.get(this.baseURL+'/loadFriends')
  }

  setMessagesAsRead(chatId:number){
    return this.http.patch("http://localhost:8080/api/v1/messageRead/"+chatId,{})
  }

  countUnreadMessages(){
    return this.http.get("http://localhost:8080/api/v1/unreadMessages")
  }

}

