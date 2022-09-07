import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Friend} from '../../domain/Friend';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit {

  public friendList:Friend[];
  public friendsNumber:number = 0;
  public friendListClosed = true;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getFriends().subscribe((data:any)=>{
      this.friendList = data;
      this.friendsNumber = this.friendList.length;
      console.log(data);
    })
  }

  toggleFriendList(){
    this.friendListClosed = !this.friendListClosed;
  }
}
