import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {BannedUserDTO} from '../../../domain/dto/BannedUserDTO';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface Reason{
  text:string;
}

@Component({
  selector: 'app-banned-users',
  templateUrl: './banned-users.component.html',
  styleUrls: ['./banned-users.component.scss'],
  animations:[ trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ])
],
})
export class BannedUsersComponent implements OnInit {
  Reasons: Reason[] =[];
  public bannedUsers:BannedUserDTO[]=[];
  columnsToDisplay = ['id', 'username', 'bannedBy'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Reason | null;

  constructor(private userService:UserService) {
    this.loadBannedUsers();
  }


  ngOnInit(): void {
    this.loadBannedUsers();
  }

  loadBannedUsers(){

    this.userService.getBannedUsers().subscribe((data:any)=>{
      this.bannedUsers = data;
      console.log(data)
      data.forEach((user)=>{this.Reasons.push(user.reason)})
    })
  }

  unbanUser(userId:number){
    console.log("odbanowano")
    this.userService.unbanUser(userId).subscribe(()=>{
      this.ngOnInit();
    })
  }
}
