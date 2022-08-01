import { Component, OnInit } from '@angular/core';
declare const connect:any;
declare const disconnect:any
declare const send:any

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  connectOn(){
    connect();
  }

  disconnectOn(){
    disconnect();
  }
  sendMsg(){
  send();
  }
}

