import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class NotificationService {

  url = 'http://localhost:8080/api/v1/notification';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  public getAllNotifications(){
    return this.http.get(this.url+'/all')
  }

  public removeNotification(notifId){
    console.log(notifId+" - NOTIFASDAD")
    return this.http.delete(this.url+'/delete/'+notifId)
  }
}
