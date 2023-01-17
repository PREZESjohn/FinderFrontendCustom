import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDTO} from '../../../../domain/dto/UserDTO';
import {CustomNotification} from '../../../../domain/CustomNotification';
import {UserMsgDTO} from '../../../../domain/dto/UserMsgDTO';
import {PlatformServiceService} from '../../../../services/platform-service.service';
import {Platform} from '../../../../domain/Platform';
import {AlertService} from '../../../../services/alert.service';

@Component({
  selector: 'app-discord-add',
  templateUrl: './discord-add.component.html',
  styleUrls: ['./discord-add.component.scss']
})
export class DiscordAddComponent implements OnInit {

  public tokenType;
  public accessToken;
  public platform: Platform;

  constructor(private platformService: PlatformServiceService, private activatedRoute: ActivatedRoute, private router: Router, private alertService: AlertService) {

    this.activatedRoute.fragment.subscribe(fragment => {
      const response = new URLSearchParams(fragment).get('access_token')
      this.accessToken = response;
      this.tokenType = new URLSearchParams(fragment).get('token_type');
      if (!this.accessToken) {
        this.router.navigateByUrl('/login')
      } else {
        this.platformService.getUserDCData(this.accessToken, this.tokenType).subscribe((data: any) => {
          this.platform = data;
          this.router.navigateByUrl('/user-profile').then(() =>
            this.alertService.success('Discord account connected')
          )
        })
      }
    })
  }

  ngOnInit(): void {
  }

}
