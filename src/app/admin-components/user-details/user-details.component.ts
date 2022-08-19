import { Component, OnInit } from '@angular/core';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {AlertService} from '../../services/alert.service';
import {MatDialog} from '@angular/material/dialog';
import {BannedUserDTO} from '../../domain/dto/BannedUserDTO';
import {CodeErrors} from '../../providers/CodeErrors';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user:User;
  public userId;
  public profilePicture;
  constructor(private dialog:MatDialog,private userService:UserService, private router:Router, private route:ActivatedRoute, private alertService:AlertService,
              private profilePicturesService:ProfilePicturesService) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userService.getProfile(this.userId).subscribe((data:any)=>{
      this.user = data;
      this.userService.getProfilePicture(data.id).subscribe((d:any)=>{
        this.profilePicture = this.userService.prepareProfilePicture(d);
      })
    },()=>{
      this.alertService.error("Cant load user data")
    })
  }

  banUser(){
    const reason = "REASON SOOON TO THINK ABOUT"
    this.userService.banUser(this.userId, reason).subscribe(()=>{
      this.ngOnInit();
      this.alertService.success("user has been banned")
    },(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }
}
