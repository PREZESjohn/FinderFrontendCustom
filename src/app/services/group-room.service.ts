import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Message} from '../domain/Message';
import {GameDTO} from '../domain/dto/GameDTO';
import {Page} from '../domain/dto/Page';

@Injectable({
  providedIn: 'root'
})
export class GroupRoomService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private httpClient: HttpClient) { }

  getGroups(): Observable<GroupRoom[]> {

    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/all');
  }

  getDeletedGroups(){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/deleted')
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

  getGroupsByGame(game: string,page: number,size:number) :Observable<Page> {
    return this.httpClient.get<any>(this.baseUrl+'/groups/all/'+game+"?page="+page+"&size="+size);
  }

  getGroupsByGameAndCategory(gameId:number,categoryId:number,page: number,size:number):Observable<Page>{
    return this.httpClient.get<any>(this.baseUrl+'/groups/G&C/'+gameId+'/'+categoryId+"?page="+page+"&size="+size)
  }

  getGroupsByGameAndRole(gameId:number,roleId:number,page: number,size:number):Observable<Page>{
    return this.httpClient.get<any>(this.baseUrl+'/groups/G&R/'+gameId+'/'+roleId+"?page="+page+"&size="+size)
  }

  getGroupsByGameCategoryRole(gameId:number,categoryId:number,roleId:number,page: number,size:number):Observable<Page>{
    return this.httpClient.get<any>(this.baseUrl+'/groups/G&C&R/'+gameId+'/'+categoryId+'/'+roleId+"?page="+page+"&size="+size)
  }

  getGroupsByGameAndCity(gameId:number,city,page: number,size:number):Observable<Page>{
    return this.httpClient.get<any>(this.baseUrl+'/groups/g&cit/'+gameId+'/'+city+"?page="+page+"&size="+size)
  }
  getGroupsByGameCategoryCity(gameId:number,categoryId:number,city,page: number,size:number):Observable<Page>{
    return this.httpClient.get<any>(this.baseUrl+'/groups/C&C/'+gameId+'/'+categoryId+'/'+city+"?page="+page+"&size="+size)
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

  getChatLongs(groupId:number){
    return this.httpClient.get(this.baseUrl+'/chatLogs/'+groupId);
  }

  getDeletedChatLogs(groupId:number){
    return this.httpClient.get(this.baseUrl+"/deletedGroupLogs/"+groupId)
  }

  editGroup(id:number, group:GroupRoom): Observable<any>{
    const headers={'content-type': 'application/json'}
    const body = JSON.stringify(group);
    return this.httpClient.put(this.baseUrl+'/groups/'+id,body,{headers});
  }
}
