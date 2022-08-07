import { Component, OnInit } from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';
import {GroupRoomService} from '../../services/group-room.service';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Message} from '../../domain/Message';
import {JoinCodeDTO} from '../../domain/dto/JoinCodeDTO';
import {ProfilePicturesService} from '../../services/profilePicturesService';

@Component({
  selector: 'app-group-show',
  templateUrl: './group-show.component.html',
  styleUrls: ['./group-show.component.scss']
})
export class GroupShowComponent implements OnInit {
  id:number = history.state.data;
  currentGroup:GroupRoom;
  inputMessage:string;
  profilePictures = null;
  isUserInGroup = false;
  isConnected = new Map();

  isAdmin = false;
  currentUser:User;
  constructor(private groupRoomService:GroupRoomService,
              private alertService:AlertService,
              private userService:UserService,
              private profilePicturesService:ProfilePicturesService,
              private router:Router) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.showGroupContent(this.id)
    this.checkIfAdmin();
    this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
  }

  showGroupContent(groupId: number) {
    if(groupId===undefined){
      groupId = Number(localStorage.getItem('groupId'));
    }else{
      localStorage.setItem('groupId',groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data:any)=>
    { this.currentGroup = data;
      this.isUserInGroup = this.tableContains(data?.users,this.currentUser);
    },
      ()=>this.alertService.error('Error while getting group room data'))
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if ( this.currentUser?.role.name === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
        this.isUserInGroup = this.tableContains(this.currentGroup?.users,data);
      }, () => {
        this.alertService.error('Error');
      }
    );
  }
  public joinGroup(groupId:number){
    this.userService.joinGroup(groupId).subscribe((data:any) => {
        this.alertService.success('You joined group');
        this.showGroupContent(groupId)
      },
      () => this.alertService.error('You are already in this group'))
  }

  generateCode(groupRoom:GroupRoom){
    this.groupRoomService.generateCode(groupRoom.id).subscribe((data:any) =>
    { const joinCodedto:JoinCodeDTO = data;
      groupRoom.joinCode = joinCodedto?.code},()=>this.alertService.error('Error while getting code'))
  }

  public makePartyLeader(user:User){
    console.log(user.id);
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.makePartyLeader(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      ()=>this.alertService.error('Error while getting group room data'))
  }

  public removeFromGroup(user:User){
    console.log(user.id);
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.removeFromGroup(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      ()=>this.alertService.error('Error while getting group room data'))
  }

  public tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table.length;i++){
      if(table[i]?.id === objectToFind?.id){
        found = true;
        break;
      }
    }
    return found
  }

  public setConnection(values:any){
    this.isConnected.set(values[0],values[1]);
    console.log(this.isConnected)
  }

}
