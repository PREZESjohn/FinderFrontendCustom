import { Component, OnInit } from '@angular/core';
import {GroupRoom} from "../../domain/GroupRoom";
import {User} from "../../domain/User";
import {GroupRoomService} from "../../services/group-room.service";
import {AlertService} from "../../services/alert.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Comment} from "../../domain/Comment";

@Component({
  selector: 'app-group-show',
  templateUrl: './group-show.component.html',
  styleUrls: ['./group-show.component.scss']
})
export class GroupShowComponent implements OnInit {
  id:number = history.state.data;
  currentGroup:GroupRoom;
  inputComment:string;

  isAdmin = false;
  currentUser:User;
  constructor(private groupRoomService:GroupRoomService,
              private alertService:AlertService,
              private userService:UserService,
              private router:Router) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.showGroupContent(this.id)
    this.checkIfAdmin();
  }

  showGroupContent(groupId: number) {
    if(groupId===undefined){
      groupId = Number(localStorage.getItem('groupId'));
    }else{
      localStorage.setItem('groupId',groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data:any)=> this.currentGroup = data,
      ()=>this.alertService.error('Error while getting group room data'))
  }

  onKey(event){
    this.inputComment = event.target.value;
  }


  public addComment(){
    if(this.inputComment!=="" && this.inputComment!=null) {
      const newComment = this.createCommentObject();
      this.groupRoomService.addComment(newComment)
        .subscribe(
          () => {
            this.ngOnInit();
          }, () => {
            this.alertService.error('Something went wrong! Try again');
          }
        );
    }else{
      this.alertService.error("Cant send empty comment");
    }
  }

  createCommentObject(){
    console.log(this.inputComment)
    const newComment = new Comment();
    newComment.groupId=this.currentGroup.id;
    newComment.text=this.inputComment;
    return newComment;
  }

  deleteComment(commentId:number){
    this.groupRoomService.deleteComment(commentId).subscribe(
      () => {
        this.alertService.success('You succesfully removed this comment');
        this.showGroupContent(this.id);
      },
      () => this.alertService.error('Error while removing comment'));
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if ( this.currentUser?.role.name === "ROLE_ADMIN") {
          this.isAdmin = true;
        }
      }, () => {
        this.alertService.error('Error');
      }
    );
  }
}
