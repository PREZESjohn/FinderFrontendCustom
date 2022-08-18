import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupRoomService} from '../../services/group-room.service';
import {AlertService} from '../../services/alert.service';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {Message} from '../../domain/Message';
import {CodeErrors} from '../../providers/CodeErrors';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-group-room-details',
  templateUrl: './group-room-details.component.html',
  styleUrls: ['./group-room-details.component.scss']
})
export class GroupRoomDetailsComponent implements OnInit, OnDestroy {

  stompClient:any
  isConnected = false;
  message:Message=new Message();
  public messages = [];
  onConnection = new EventEmitter<any>()

  public groupRoom:GroupRoom;
  public groupRoomId;
  public profilePictures;
  public admin:User;

  constructor(private router:Router, private route:ActivatedRoute, private groupRoomService:GroupRoomService,
              private userService:UserService,
              private alertService:AlertService,private profilePicturesService:ProfilePicturesService, private authService:AuthService) {
    this.groupRoomId = this.route.snapshot.paramMap.get('id');
    this.loadGroup();
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((data:any)=>{
      this.admin = data;
    })
    this.loadGroup();
  }

  ngOnDestroy() {
    this.disconnect();
  }


  loadGroup(){
    this.groupRoomService.showGroupContent(this.groupRoomId).subscribe((data:any)=>{
        this.groupRoom = data;
        this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
        if(this.profilePictures.size===0){
          this.profilePicturesService.setUsersProfilePictureForGroup(data);
          this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
        }
      },
      (e)=>{
        this.alertService.error("Cant load group room");
      })
  }
//TODO ZOPTYMALIZWAC TO NA DOLE BO BEKA
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

  public togglePrivate(group:GroupRoom){
    const groupId = group.id;
    const result = !group.open;
    group.open = result;
    this.groupRoomService.setIsPrivateValue(groupId,result).subscribe()
  }

  removeGroupRoom(){
    this.groupRoomService.deleteGroup(this.groupRoomId).subscribe(()=>{
      this.router.navigateByUrl('/admin/admin-main-page').then(()=>
        this.alertService.success("Group "+this.groupRoom.name+" has beenremoved")
      )
    },(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }


  loadChatLogs(){
    this.groupRoomService.getChatLongs(this.groupRoomId).subscribe((data:any)=>{
      this.messages = data;
    },(e)=>{
      this.alertService.error(CodeErrors.get(e));
      }
    )
  }

  readMsg(text){
      this.message.text = text;
  }

  sendMsg(){
    this.message.user = this.admin;
    this.message.groupId = this.groupRoom.id;
    // tslint:disable-next-line:max-line-length
    this.stompClient.send('/app/chat/'+this.groupRoom.id,{}, JSON.stringify(this.message));
    this.message.text = '';
  }


  connect(){
    console.log("TEST")
    const headers={
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'groupId': this.groupRoom?.id
    }
    if(this.isConnected===false) {
      this.stompClient = Stomp.over(()=>{
        return new SockJS('http://localhost:8080/ws',headers)
      });
      this.stompClient.connect(headers, (frame) => {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        this.stompClient.subscribe('/topic/messages/'+this.groupRoom.id, (chatMessage) => {
          const data = JSON.parse(chatMessage.body)
          this.messages.push(data);
          if(data?.connectedUsers!==null && data?.connectedUsers!==undefined){
            this.groupRoom.users.forEach((u)=>{
              this.onConnection.emit([u.id,false])
            })
            data?.connectedUsers.forEach((user)=>{
              this.onConnection.emit([user,true])
            })}
        });
      });
    }
  }

  disconnect(){
    if (this.stompClient !== null && this.stompClient !== undefined) {
      this.stompClient?.disconnect();
      console.log('Disconnected');
      this.isConnected=false;
      this.stompClient=null;
    }else{
      console.log('Not in group')
    }
  }
}
