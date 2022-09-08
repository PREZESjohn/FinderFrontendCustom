import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Friend} from '../../domain/Friend';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from '../../services/auth.service';
import {Message} from '../../domain/Message';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit {
  public stompClient:any
  public friendList:Friend[];
  public friendsNumber:number = 0;
  public friendListClosed = true;
  public isConnectedToChat = false;
  public messages:Message[]=[];
  public message:Message=new Message();
  public chosenFriend:Friend = null;
  public currentChatId:number;
  constructor(private userService: UserService,private authService:AuthService) { }

  ngOnInit(): void {
    this.userService.getFriends().subscribe((data:any)=>{
      this.friendList = data;
      this.friendsNumber = this.friendList.length;
      console.log(data);
    })
  }

  toggleFriendList(){
    if(this.isConnectedToChat){
      this.disconnectPrivateChat();
    }
    this.friendListClosed = !this.friendListClosed;
  }

  connectPrivateChat(chatId:number,friend:Friend){
    const headers={
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'chatId': chatId
    }
    if(this.isConnectedToChat){
      this.disconnectPrivateChat();
    }
    else if(this.isConnectedToChat===false) {
      this.stompClient = Stomp.over(()=>{
        return new SockJS('http://localhost:8080/ws',headers)
      });
      this.stompClient.connect(headers, (frame) => {
        console.log('Connected: ' + frame);
        this.isConnectedToChat = true;
        this.currentChatId=chatId;
        this.chosenFriend = friend;
        this.ngOnInit();
        this.stompClient.subscribe('/topic/privateMessages/'+chatId, (chatMessage) => {
          const data = JSON.parse(chatMessage.body)
          this.messages.push(data);
        });
      });
    }
  }

  disconnectPrivateChat(){
    if (this.stompClient !== null && this.stompClient !== undefined) {
      this.stompClient?.disconnect();
      console.log('Disconnected');
      this.isConnectedToChat=false;
      this.stompClient=null;
      this.chosenFriend = null;
      this.messages = [];
    }else{
      console.log('Not in group')
    }
  }
  readMsg(text){
    this.message.text = text;
  }

  sendMsg(chatId:number){
    // tslint:disable-next-line:max-line-length
    this.stompClient.send('/app/privateChat/'+chatId,{}, JSON.stringify(this.message));
    this.message.text = '';
  }
}
