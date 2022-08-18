import { Component, OnInit } from '@angular/core';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user:User;
  public userId;

  constructor(private userService:UserService, private router:Router, private route:ActivatedRoute, private alertService:AlertService,
              private profilePicturesService:ProfilePicturesService) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userService.getProfile(this.userId).subscribe((data:any)=>{
      this.user = data;
    },()=>{
      this.alertService.error("Cant load user data")
    })
  }
}
