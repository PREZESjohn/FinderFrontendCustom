import { Component, OnInit } from '@angular/core';
import {UserDTO} from '../../domain/dto/UserDTO';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {Report} from '../../domain/Report';
import {CodeErrors} from '../../providers/CodeErrors';
import {CategoryService} from '../../services/categoryService';
import {Platform} from '../../domain/Platform';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.scss']
})
export class OtherUserProfileComponent implements OnInit {

  user: UserDTO;
  chosenUserId;
  lastUrl = ''
  profilePicture=null;
  platformMap = new Map();
  public games;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router,private categoryService:CategoryService, private route:ActivatedRoute) {
    this.chosenUserId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.userService.getProfile(this.chosenUserId).subscribe(
      (data:any) => {
        this.user = data

        this.mapPlatforms(this.user.platforms);

        this.userService.getProfilePicture(data.id).subscribe((d:any)=>{
          this.profilePicture = this.userService.prepareProfilePicture(d);
        })
      }, () => {
        this.alertService.error('User not found');
        this.router.navigateByUrl(this.lastUrl)
      }
    );
    if(this.categoryService.getAllGames().length==0){
      this,this.categoryService.getGames().subscribe((data:any)=>{
          this.games = data;
        }
      )
    }else {
      this.games = this.categoryService.getAllGames();
    }

  }

  mapPlatforms(platforms:Platform[]){
    if (platforms != undefined) {
      platforms.forEach((platform) => {
        this.platformMap.set(platform.platformType, platform);
      })
    }
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

  tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table?.length;i++){
      if(table[i].id === objectToFind.id){
        found = true;
        break;
      }
    }
    return found
  }

  sendFriendRequest(){
    this.userService.sendFriendRequest(this.user).subscribe(()=>{
    },(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    });
  }
}
