import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../../domain/Message';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnChanges,OnDestroy {
  stompClient:any
  @Input() groupRoom:GroupRoom = null;
  @Input() currentUser:User = null;
  @Input() isInGroup = false;
  @Input() usersPictures = null;

  message:Message=new Message();
  messages = [];

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.connectOn();
  }
  ngOnChanges(){
    if(this.isInGroup){
    this.connectOn();}
    else{
      this.disconnectOn();
    }
  }

  connectOn(){
    const headers={
      'Authorization': 'Bearer ' + this.authService.getToken()
    }
    if(this.isInGroup) {
      // const socket = new SockJS('http://localhost:8080/ws',headers);
      this.stompClient = Stomp.over(()=>{
        return new SockJS('http://localhost:8080/ws',headers)
      });
      this.stompClient.connect(headers, (frame) => {
        console.log('Connected: ' + frame);
        this.stompClient.subscribe('/topic/messages/'+this.groupRoom.id, (chatMessage) => {
          const data = JSON.parse(chatMessage.body)
          this.messages.push(data);
        });
      });
    }
  }

  disconnectOn(){
    if (this.stompClient !== null && this.stompClient !== undefined) {
      this.stompClient?.disconnect();
      console.log('Disconnected');
      this.stompClient=null;
    }else{
      console.log('Not in group')
    }
  }

  readMsg(text){
    this.message.text = text;
  }

  sendMsg(){
    const headers={
      Authorization: 'Bearer ' + this.authService.getToken()
    }
    this.message.user = this.currentUser;
    this.message.groupId = this.groupRoom.id;
    // tslint:disable-next-line:max-line-length
    this.stompClient.send('/app/chat/'+this.groupRoom.id,{}, JSON.stringify(this.message));
    this.message.text = '';
  }

  ngOnDestroy(){
    this.disconnectOn();
  }
}

