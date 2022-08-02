import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Stomp} from '../../../assets/js/stomp.js';
import * as SockJS from 'sockjs-client';
import {Message} from '../../domain/Message';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';


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
  constructor() { }

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
    if(this.isInGroup) {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, (frame) => {
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
    }else{
      console.log('Not in group')
    }
  }

  readMsg(text){
    this.message.text = text;
  }

  sendMsg(){
    this.message.user = this.currentUser;
    this.message.groupId = this.groupRoom.id;
    this.stompClient.send('/app/chat/'+this.groupRoom.id, {groupId:this.groupRoom.id}, JSON.stringify(this.message));
    this.message.text = '';
  }

  ngOnDestroy(){
    this.disconnectOn();
  }
}

