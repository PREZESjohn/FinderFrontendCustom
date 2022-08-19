import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../domain/User';
import {Message} from '../../../domain/Message';

@Component({
  selector: 'app-user-chat-logs',
  templateUrl: './user-chat-logs.component.html',
  styleUrls: ['./user-chat-logs.component.scss']
})
export class UserChatLogsComponent implements OnInit,OnChanges {

  @Input() userId:number;
  messages:Message[];
  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }
  ngOnChanges(){
    this.loadChatLogs();
  }
    //TODO NARAZIE ZWYKLE POBIERANIE SAMYCH MSG TRZEBA DODAC ODPOWIEDNI MODEL DTO I LADNIE TO WYSWIETLAC W ZALEZNOSCI OD GRUP
  loadChatLogs(){
    console.log(this.userId)
    this.userService.getUserChatLogs(this.userId).subscribe((data:any)=>{
      this.messages = data;
    },(e)=>{

    })

  }

}
