import {Component, Inject, OnInit} from '@angular/core';
import {GroupRoomService} from '../../../../services/group-room.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-group-chat-logs-dialog',
  templateUrl: './group-chat-logs-dialog.component.html',
  styleUrls: ['./group-chat-logs-dialog.component.scss']
})
export class GroupChatLogsDialogComponent implements OnInit {
  public messages;

  constructor(private groupRoomService:GroupRoomService ,@Inject(MAT_DIALOG_DATA) public data: any) {

    this.groupRoomService.getDeletedChatLogs(data.id).subscribe((data:any)=>{
      this.messages = data;
    })
  }


  ngOnInit(): void {

  }

}
