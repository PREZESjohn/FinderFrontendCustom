import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {CodeErrors} from '../../../providers/CodeErrors';
import {EmailDto} from '../../../domain/dto/EmailDto';

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.scss']
})
export class EmailChangeComponent implements OnInit {

  public inputMode = true;
  public email = '';

  constructor(private alertService: AlertService, private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  changeEmail() {
    let emailDTO = new EmailDto();
    emailDTO.email = this.email
    this.authService.changeEmail(emailDTO).subscribe(() => {
      this.inputMode = false;
    }, (error) => {
      this.inputMode = true;
      if (error.error.code == null) {
        this.alertService.error('Type correct email. Example - example@gmail.com')
      } else {
        this.alertService.error(CodeErrors.get(error.error.code))
      }
    })
  }
}
