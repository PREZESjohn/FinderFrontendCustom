import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Comment} from '../domain/Comment';

@Injectable({
  providedIn: 'root'
})
export class GroupRoomService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private httpClient: HttpClient) { }

  getGroups(): Observable<GroupRoom[]> {

    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/all');
  }

  deleteGroup(groupId: number) {
    const url = this.baseUrl + '/groups/' + groupId;

    return this.httpClient.delete(url);
  }

  addGroup(newGroup: GroupRoom) {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(newGroup);
    return this.httpClient.post<GroupRoom>(this.baseUrl + '/groups/add',body,{headers});
  }

  deleteComment(commentId: number) {
    const url = this.baseUrl + '/groups/comment/'+commentId;
    return this.httpClient.delete(url);
  }

  showGroupContent(groupId:number):Observable<GroupRoom>{
    return this.httpClient.get<GroupRoom>(this.baseUrl+'/groups/' + groupId)
  }

  addComment(newComment: Comment){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(newComment);
    return this.httpClient.post<Comment>(this.baseUrl+'/groups/newComment',body,{headers});
  }

}
