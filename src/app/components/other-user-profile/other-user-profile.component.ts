import { Component, OnInit } from '@angular/core';
import {UserDTO} from '../../domain/dto/UserDTO';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {Report} from '../../domain/Report';
import {CodeErrors} from '../../providers/CodeErrors';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.scss']
})
export class OtherUserProfileComponent implements OnInit {

  user: UserDTO;
  chosenUserId;
  // chosenUserId = history.state.userProfileId;
  lastUrl = ''
  profilePicture=null;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router, private route:ActivatedRoute) {
    this.chosenUserId = this.route.snapshot.paramMap.get("id");
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

  reportUser(reason:string){
    const report = new Report();
    report.reason = reason;
    this.userService.reportUser(report,this.user.id).subscribe(()=>{
      this.alertService.success("User reported")
    },(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }
}
