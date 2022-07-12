import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profileEditForm: FormGroup;
  userToEdit: User;
  constructor(private userService:UserService,
              private formBuilder: FormBuilder,
              private router:Router,
              private activeRoute: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      console.log(params);
      this.userService.getUser().subscribe(
        data => {
          this.userToEdit = data
        }, () => {
          this.alertService.error('Error');
        }
      );
      this.initializeForm();
    });
  }

  private initializeForm() {
    this.profileEditForm = this.formBuilder.group({
      editUserProfile: this.formBuilder.group({
        username: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        name: new FormControl('',
          [Validators.minLength(2)]),
        email: new FormControl('',[Validators.minLength(2)]),
      })
    });
  }

  editProfile() {
    const profileData = this.createUserObject();
    console.log(profileData);
    this.userService.editUser(profileData)
      .subscribe(
        () => {
          this.router.navigateByUrl('/dashboard');
        }, () => {
          this.alertService.error('Something went wrong');
        }
      );
  }

  private createUserObject(): User {
    this.userToEdit.username = this.profileEditForm.get('editUserProfile').get('username').value;
    this.userToEdit.name = this.profileEditForm.get('editUserProfile').get('name').value;
    this.userToEdit.email = this.profileEditForm.get('editUserProfile').get('email').value;

    return this.userToEdit;
  }
}
