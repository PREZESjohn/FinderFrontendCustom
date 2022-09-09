import {Component, ElementRef, OnChanges, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Friend} from '../../domain/Friend';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from '../../services/auth.service';
import {Message} from '../../domain/Message';
import {AlertService} from '../../services/alert.service';
import {CustomNotification} from '../../domain/CustomNotification';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit {

  @ViewChild('content') content!: ElementRef;
  @ViewChildren('messagesTracker1') messagesTracker1!: QueryList<any>;
  @ViewChildren('messagesTracker2') messagesTracker2!: QueryList<any>;

  public stompClient:any
  public friendList:Friend[];
  public friendsNumber:number = 0;
  public friendListClosed = true;
  public isConnectedToChat = false;
  public messages:Message[]=[];
  public message:Message=new Message();
  public chosenFriend:Friend = null;
  public currentChatId:number;
  public eventSource;


  constructor(private userService: UserService,private authService:AuthService,private alertService:AlertService) {

    this.eventSource = this.alertService.getSource();

    this.eventSource.addEventListener('message', message => {
      const msg: CustomNotification = JSON.parse(message.data);
      console.log("MESSAGE TYPE - "+msg.type)
      if(msg.type=='FRIENDREQUEST') {
        this.ngOnInit()
      }
    })
  }

  ngOnInit(): void {
    this.userService.getFriends().subscribe((data:any)=>{
      this.friendList = data;
      this.friendsNumber = this.friendList.length;
    })
    this.scrollToBottom();
    this.messagesTracker1.changes.subscribe(this.scrollToBottom);
    this.messagesTracker2.changes.subscribe(this.scrollToBottom);
  }


  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {
    }
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

  refreshList(){
    this.ngOnInit();
  }

  sendMsg(chatId:number){
    // tslint:disable-next-line:max-line-length
    this.stompClient.send('/app/privateChat/'+chatId,{}, JSON.stringify(this.message));
    this.message.text = '';
  }
}
