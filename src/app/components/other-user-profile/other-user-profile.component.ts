import { Component, OnInit } from '@angular/core';
import {UserDTO} from '../../domain/dto/UserDTO';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.scss']
})
export class OtherUserProfileComponent implements OnInit {

  user: UserDTO;
  chosenUserId = history.state.userProfileId;
  lastUrl = ''
  profilePicture=null;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getProfile(this.chosenUserId).subscribe(
      (data:any) => {
        this.user = data
        this.userService.getProfilePicture(data.id).subscribe((d:any)=>{
          this.profilePicture = this.userService.prepareProfilePicture(d);
        })
      }, () => {
        this.alertService.error('User not found');
        this.router.navigateByUrl(this.lastUrl)
      }
    );
  }
}
