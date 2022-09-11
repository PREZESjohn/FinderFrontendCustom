import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
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
  @Output() onConnection = new EventEmitter<any>()

  @ViewChild('content') content!: ElementRef;
  @ViewChildren('messagesTracker') messagesTracker!: QueryList<any>;

  public isConnected = false;
  public message:Message=new Message();
  public messages = [];

  constructor(private authService:AuthService) { }

  ngOnInit(): void {

  }

  ngOnChanges(){
    if(this.isInGroup){
    this.connectOn();}
    else{
      this.disconnectOn();
    }
    this.scrollToBottom();
    this.messagesTracker?.changes.subscribe(this.scrollToBottom);

  }

  connectOn(){
    const headers={
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'groupId': this.groupRoom?.id
    }
    if(this.isInGroup && this.isConnected===false) {
      this.stompClient = Stomp.over(()=>{
        return new SockJS('http://localhost:8080/ws',headers)
      });
      this.stompClient.connect(headers, (frame) => {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        this.stompClient.subscribe('/topic/messages/'+this.groupRoom.id, (chatMessage) => {
          let data = JSON.parse(chatMessage.body)
           data = this.splitDate(data)
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

  disconnectOn(){
    if (this.stompClient !== null && this.stompClient !== undefined) {
      this.stompClient?.disconnect();
      console.log('Disconnected');
      this.isConnected=false;
      this.stompClient=null;
    }else{
      console.log('Not in group')
    }
  }

  splitDate(data:Message){
    if(data.date!==null) {
      const x = data.date?.split(" ")
      data.date = x[0];
      data.time = x[1];
      return data
    }
    return data;
  }

  readMsg(text){
    this.message.text = text;
  }

  sendMsg(){
    this.message.user = this.currentUser;
    this.message.groupId = this.groupRoom.id;
    // tslint:disable-next-line:max-line-length
    this.stompClient.send('/app/chat/'+this.groupRoom.id,{}, JSON.stringify(this.message));
    this.message.text = '';
  }

  ngOnDestroy(){
    this.disconnectOn();
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {
    }
  }
}

