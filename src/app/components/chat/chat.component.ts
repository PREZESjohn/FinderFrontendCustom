import { Component, OnInit } from '@angular/core';
import {Stomp} from '../../../assets/js/stomp.js';
import * as SockJS from 'sockjs-client';
import {Message} from '../../domain/Message';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  stompClient:any
  constructor() { }

  ngOnInit(): void {
  }

  connectOn(){
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) =>{
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/messages' , (chatMessage)=> {
        console.log(chatMessage)
      });
  });
  }

  disconnectOn(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }
  sendMsg(text){
    console.log('test');
    const message:Message = new Message();
    message.text = text;
    this.stompClient.send('/app/temp', {}, JSON.stringify(message));
  }
}

