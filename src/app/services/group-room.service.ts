import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Message} from '../domain/Message';
import {GameDTO} from '../domain/dto/GameDTO';

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
  showGroupContent(groupId:number):Observable<GroupRoom>{
    return this.httpClient.get<GroupRoom>(this.baseUrl+'/groups/' + groupId)
  }
  getGroupsByGame(game: string) {
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/all/'+game);
  }

  getGroupsByGameAndCategory(gameId:number,categoryId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&C/'+gameId+'/'+categoryId)
  }

  getGroupsByGameAndRole(gameId:number,roleId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&R/'+gameId+'/'+roleId)
  }

  getGroupsByGameCategoryRole(gameId:number,categoryId:number,roleId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&C&R/'+gameId+'/'+categoryId+'/'+roleId)
  }

  setIsPrivateValue(groupId:number,value:boolean){
    return this.httpClient.patch(this.baseUrl+'/groups/changeVisibility/'+groupId+'/'+value,{})
  }
  generateCode(groupId:number){
    return this.httpClient.get(this.baseUrl+'/groups/generateCode/'+groupId)
  }

  joinByCode(code:string){
    return this.httpClient.patch(this.baseUrl+'/groups/joinByCode/'+code,{});
  }

  makePartyLeader(groupId:number,userId:number){
    return this.httpClient.patch(this.baseUrl+'/groups/makeLeader/'+groupId+'/'+userId,{})
  }

  removeFromGroup(groupId:number,userId:number){
    return this.httpClient.patch(this.baseUrl+'/groups/removeUser/'+groupId+'/'+userId,{})
  }
}
