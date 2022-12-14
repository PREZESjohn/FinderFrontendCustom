import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {CategoryService} from '../../services/categoryService';
import {GameDTO} from '../../domain/dto/GameDTO';
import {InGameRoles} from '../../domain/dto/InGameRoles';
import {CodeErrors} from '../../providers/CodeErrors';
import {MatDialog} from '@angular/material/dialog';
import {Platform} from '../../domain/Platform';
import {cityList} from "../../providers/Cities";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profileEditForm: FormGroup;
  userToEdit: User;
  games: GameDTO[];
  isEditOff = true;
  tempRoleList: InGameRoles[] = [];
  buttonFunction = 'Edit';
  profilePicture = null;
  pictureFile = null;
  isPictureChanged = false;
  platformMap = new Map();
  cities;
  city;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private activeRoute: ActivatedRoute,
              private alertService: AlertService,
              public dialog: MatDialog) {
    this.cities = cityList;
    this.city = cityList[0].name
  }

  ngOnInit(): void {
    if (this.categoryService.getAllGames().length == 0) {
      this, this.categoryService.getGames().subscribe((data: any) => {
          this.games = data;
        }
      )
    } else {
      this.games = this.categoryService.getAllGames();
    }
    this.activeRoute.paramMap.subscribe(params => {
      this.userService.getUser().subscribe(
        data => {
          this.userToEdit = data;
          this.profileEditForm.get('editUserProfile').get('city').setValue(this.userToEdit?.city);
          this.mapPlatforms(this.userToEdit.platforms);
          this.userService.getProfilePicture(data.id).subscribe((d: any) => {
            this.profilePicture = this.userService.setProfilePicture(d);
          }, () => {
            this.profilePicture = 'assets/img/default-avatar.png'
          })
        }, () => {
          this.alertService.error('Error');
        }
      );
      this.initializeForm();
      this.disableInputs();
    });
  }

  private initializeForm() {
    this.profileEditForm = this.formBuilder.group({
      editUserProfile: this.formBuilder.group({
        name: new FormControl('',
          [Validators.minLength(2),Validators.pattern('^[a-zA-Z]{2,20}$')]),
        email: new FormControl('', [Validators.minLength(2), Validators.pattern('[a-z0-9.+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')]),
        city: new FormControl('', [Validators.minLength(2)]),
        age: new FormControl('', [Validators.min(1),Validators.max(150)]),
        phone: new FormControl('', [Validators.minLength(9), Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]),
        info: new FormControl('', [Validators.minLength(5), Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9.,\\s]{3,150}$')])


      })
    });
  }

  mapPlatforms(platforms: Platform[]) {
    if (platforms != undefined) {
      platforms.forEach((platform) => {
        this.platformMap.set(platform.platformType, platform);
      })
    }
  }

  editProfile() {
    if (this.profileEditForm.valid) {
      const profileData = this.createUserObject();
      this.userService.editUser(profileData)
        .subscribe(
          () => {
            this.router.navigateByUrl('/user-profile');
            this.alertService.success('Data updated');
          }, (e) => {
            this.alertService.error(CodeErrors.get(e.error.code));
          }
        );
    } else {
      if (this.profileEditForm.get('editUserProfile').get('name').errors !== null) {
        this.alertService.error('Minimum 2 letters for name')
      } else if (this.profileEditForm.get('editUserProfile').get('email').errors !== null) {
        this.alertService.error('Bad email')
      } else if (this.profileEditForm.get('editUserProfile').get('city').errors !== null) {
        this.alertService.error('Minimum 2 letters for city')
      } else if (this.profileEditForm.get('editUserProfile').get('age').errors !== null) {
        this.alertService.error('Age can be from 0-999')
      } else if (this.profileEditForm.get('editUserProfile').get('phone').errors !== null) {
        this.alertService.error('Phone number must be 9 digits ')
      } else if (this.profileEditForm.get('editUserProfile').get('info').errors !== null) {
        this.alertService.error('Info can be in range of 5 to 150')
      }
    }
  }

  private createUserObject(): User {
    this.userToEdit.name = this.profileEditForm.get('editUserProfile').get('name').value;
    this.userToEdit.age = this.profileEditForm.get('editUserProfile').get('age').value;
    this.userToEdit.email = this.profileEditForm.get('editUserProfile').get('email').value;
    this.userToEdit.phone = this.profileEditForm.get('editUserProfile').get('phone').value;
    this.userToEdit.city = this.profileEditForm.get('editUserProfile').get('city').value;
    this.userToEdit.info = this.profileEditForm.get('editUserProfile').get('info').value;

    return this.userToEdit;
  }

  public disableInputs() {
    this.profileEditForm.get('editUserProfile').get('name').disable()
    this.profileEditForm.get('editUserProfile').get('age').disable()
    this.profileEditForm.get('editUserProfile').get('email').disable()
    this.profileEditForm.get('editUserProfile').get('phone').disable()
    this.profileEditForm.get('editUserProfile').get('city').disable()
    this.profileEditForm.get('editUserProfile').get('info').disable()
  }

  public enableInputs() {
    this.profileEditForm.get('editUserProfile').get('name').enable();
    this.profileEditForm.get('editUserProfile').get('age').enable();
    this.profileEditForm.get('editUserProfile').get('phone').enable();
    this.profileEditForm.get('editUserProfile').get('city').enable();
    this.profileEditForm.get('editUserProfile').get('info').enable();
  }

  public turnEditMode() {
    console.log(this.userToEdit)
    this.alertService.clear();
    if (this.buttonFunction === 'Edit') {
      this.enableInputs();
      this.isEditOff = false;
      this.userToEdit?.inGameRoles.forEach(val => this.tempRoleList.push(Object.assign({}, val)))
      this.buttonFunction = 'Save changes';
    } else {
      this.editProfile();
      this.buttonFunction = 'Edit'
      this.isEditOff = true;
      this.tempRoleList = [];
      this.disableInputs();
    }
  }

  public cancelEdit() {
    this.disableInputs();
    this.buttonFunction = 'Edit'
    this.isEditOff = true;
    this.userToEdit.inGameRoles = this.tempRoleList;
    this.tempRoleList = [];
  }

  public onFileSelected(e) {
    if (e.target.files && e.target.files[0]) {
      this.pictureFile = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (ev) => {
        this.profilePicture = ev.target.result;
        this.isPictureChanged = true;
      }
    }
  }

  public uploadFile() {
    this.userService.uploadProfilePicture(this.pictureFile).subscribe(() => {
      this.userService.getProfilePicture(this.userToEdit?.id).subscribe((data: any) => {
        this.profilePicture = this.userService.setProfilePicture(data)
        this.alertService.success('Changes saved');
        this.isPictureChanged = false;
      }, () => {
        this.alertService.error('Error')
      })
    }, () => {
      this.alertService.error('Error')
    })

  }

  tableContains(table, objectToFind): boolean {
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < table?.length; i++) {
      if (table[i].id === objectToFind.id) {
        found = true;
        break;
      }
    }
    return found
  }

  public editRole(role: InGameRoles) {
    if (this.tableContains(this.userToEdit?.inGameRoles, role)) {
      const index = this.userToEdit?.inGameRoles.findIndex((o) => {
        return o.id === role.id
      });
      if (index > -1) {
        this.userToEdit?.inGameRoles.splice(index, 1);
      }
    } else {
      this.userToEdit?.inGameRoles.push(role);
    }
  }


  public changeCity(e) {
    const temp = this.cities.map(a =>{ if(a.name === e.target.value){return a}else return
    }).filter((value)=>{return value !== undefined});
    this.city = temp[0];
    this.profileEditForm.get('editUserProfile').get('city').setValue(e.target.value,{onlySelf:true});
    //this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers,{onlySelf:true})
  }
}
