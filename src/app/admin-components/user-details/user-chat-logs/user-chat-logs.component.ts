import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../domain/User';
import {Message} from '../../../domain/Message';
import {MessageLogsDTO} from '../../../domain/dto/MessageLogsDTO';

@Component({
  selector: 'app-user-chat-logs',
  templateUrl: './user-chat-logs.component.html',
  styleUrls: ['./user-chat-logs.component.scss']
})
export class UserChatLogsComponent implements OnInit,OnChanges {

  @Input() userId:number;
  messageGroups = [];
  msgMap = new Map();
  panelOpenState = false;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }
  ngOnChanges(){
    this.loadChatLogs();
  }

  loadChatLogs(){
    console.log(this.userId)
    this.userService.getUserChatLogs(this.userId).subscribe((data:any)=>{
      this.sortMessages(data);
    },(e)=>{

    })

  }

  sortMessages(messages){
    messages.forEach((message)=>{
      if(this.msgMap.get(message.groupName)!==undefined){
        const msgArray = this.msgMap.get(message.groupName)
        msgArray.push(message)
        this.msgMap.set(message.groupName,msgArray);
      }else {
        this.msgMap.set(message.groupName, [message])
      }
    })
    console.log(this.msgMap)
    this.msgMap.forEach((value,key)=>{
      this.messageGroups.push(key)
    })
    console.log(this.messageGroups)
  }

}
