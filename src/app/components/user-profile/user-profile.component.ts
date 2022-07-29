import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../domain/User';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {CategoryService} from '../../services/categoryService';
import {GameDTO} from '../../domain/dto/GameDTO';
import {InGameRoles} from '../../domain/dto/InGameRoles';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profileEditForm: FormGroup;
  userToEdit: User;
  games:GameDTO[];
  isEditOff=true;
  tempRoleList:InGameRoles[]=[];
  buttonFunction = 'Edit';
  profilePicture = null;
  pictureFile=null;
  isPictureChanged=false;
  constructor(private userService:UserService,
              private formBuilder: FormBuilder,
              private router:Router,
              private categoryService:CategoryService,
              private activeRoute: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.games = this.categoryService.getAllGames();
    console.log(this.games);
    this.activeRoute.paramMap.subscribe(params => {
      console.log(params);
      this.userService.getUser().subscribe(
        data => {
          this.userToEdit = data
          this.userService.getProfilePicture(data.id).subscribe((d:any)=>{
            this.profilePicture = this.userService.setProfilePicture(d);},()=>{
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
          [Validators.minLength(2)]),
        email: new FormControl('',[Validators.minLength(2)]),
        city: new FormControl('',[Validators.minLength(2)]),
        age: new FormControl('',[Validators.minLength(2),Validators.pattern('^[0-9]*$'),Validators.maxLength(3)]),
        phone: new FormControl('',[Validators.minLength(9), Validators.maxLength(9)]),
        info:new FormControl('',[Validators.minLength(5),Validators.maxLength(45)])
      })
    });
  }

  editProfile() {
    const profileData = this.createUserObject();
    console.log(profileData);
    this.userService.editUser(profileData)
      .subscribe(
        () => {
          this.router.navigateByUrl('/user-profile');
          this.alertService.success('Data updated');
        }, () => {
          this.alertService.error('Something went wrong');
        }
      );
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

  public disableInputs(){
    this.profileEditForm.get('editUserProfile').get('name').disable()
    this.profileEditForm.get('editUserProfile').get('age').disable()
    this.profileEditForm.get('editUserProfile').get('email').disable()
    this.profileEditForm.get('editUserProfile').get('phone').disable()
    this.profileEditForm.get('editUserProfile').get('city').disable()
    this.profileEditForm.get('editUserProfile').get('info').disable()
  }

  public enableInputs(){
    this.profileEditForm.get('editUserProfile').get('name').enable();
    this.profileEditForm.get('editUserProfile').get('age').enable();
    this.profileEditForm.get('editUserProfile').get('email').enable();
    this.profileEditForm.get('editUserProfile').get('phone').enable();
    this.profileEditForm.get('editUserProfile').get('city').enable();
    this.profileEditForm.get('editUserProfile').get('info').enable();
  }

  public turnEditMode(){
    this.alertService.clear();
    if(this.buttonFunction === 'Edit') {
      this.enableInputs();
      this.isEditOff = false;
      this.userToEdit?.inGameRoles.forEach(val => this.tempRoleList.push(Object.assign({},val)))
      this.buttonFunction = 'Save changes';
    }
    else{
      this.editProfile();
      this.buttonFunction = 'Edit'
      this.isEditOff = true;
      this.disableInputs();
    }
  }
  public cancelEdit(){
    this.disableInputs();
    this.buttonFunction='Edit'
    this.isEditOff = true;
    this.userToEdit.inGameRoles = this.tempRoleList;
    this.tempRoleList=[];
  }
  public onFileSelected(e){
    if(e.target.files && e.target.files[0]){
      this.pictureFile=e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (ev)=>{
        this.profilePicture = ev.target.result;
        this.isPictureChanged=true;
      }
    }
    // console.log(this.profilePicture)
  }

  public uploadFile(){
    this.userService.uploadProfilePicture(this.pictureFile).subscribe(()=>{
      this.userService.getProfilePicture(this.userToEdit?.id).subscribe((data:any)=>{
        this.profilePicture = this.userService.setProfilePicture(data);
        window.location.reload();
        this.alertService.success("Changes saved");
        this.isPictureChanged=false;
      },()=>{
        this.alertService.error("Error")
      })
    },()=>{
      this.alertService.error("Error")})

  }

  tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table?.length;i++){
      // console.log(table[i].id+'  '+objectToFind.id)
      if(table[i].id === objectToFind.id){
        found = true;
        break;
      }
    }
    return found
  }
  public editRole(role:InGameRoles){
    if(this.tableContains(this.userToEdit?.inGameRoles,role)){
      const index = this.userToEdit?.inGameRoles.findIndex((o)=>{return o.id === role.id});
      console.log(index)
      if(index >- 1){
        this.userToEdit?.inGameRoles.splice(index,1);
      }
    }else{
      this.userToEdit?.inGameRoles.push(role);
    }
    console.log(this.tempRoleList)
    console.log(this.userToEdit?.inGameRoles)
  }

}
