import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';
import {GroupRoomService} from '../../services/group-room.service';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../../domain/Message';
import {JoinCodeDTO} from '../../domain/dto/JoinCodeDTO';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {AuthService} from '../../services/auth.service';
import {CodeErrors} from '../../providers/CodeErrors';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';

declare let EventSource:any;

@Component({
  selector: 'app-group-show',
  templateUrl: './group-show.component.html',
  styleUrls: ['./group-show.component.scss']
})
export class GroupShowComponent implements OnInit,OnDestroy {
  // id:number = history.state.data;
  id:number;
  currentGroup:GroupRoom;
  profilePictures = null;
  isUserInGroup = false;
  isConnected = new Map();

  isAdmin = false;
  isEditOff=true;
  buttonFunction = 'Edit';
  editGroupRoom=new GroupRoom();
  groupEditForm: FormGroup;
  public source;
  currentUser:User;
  constructor(private groupRoomService:GroupRoomService,
              private alertService:AlertService,
              private userService:UserService,
              private profilePicturesService:ProfilePicturesService,
              private authService:AuthService,
              private router:Router,
              private dialog:MatDialog,
              private route:ActivatedRoute,
              private formBuilder: FormBuilder) {

    this.id = +this.route.snapshot.paramMap.get('id');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.source = new EventSource('http://localhost:8080/api/v1/notify/test?token='+this.authService.getToken());
    this.source.addEventListener('message', message =>{
      const msg:Message = JSON.parse(message.data);
      if(msg.negative){
        this.alertService.error(msg.text);}
      else{
        this.alertService.success(msg.text)
      }
      this.checkIfAdmin();
      this.showGroupContent(this.id);
      if(msg.type==='REMOVED' && msg.groupId === this.currentGroup.id){
        router.navigateByUrl('/home-page')
      }
      window.setTimeout(()=> {
        this.alertService.clear()},8000);
    })
    this.dialog.closeAll();

    }

  ngOnInit(): void {
    this.showGroupContent(this.id)
    this.checkIfAdmin();
    this.initializeForm();
  }

  ngOnDestroy() {
    this.source.close();
  }

  navigateToProfile(profile){
    this.router.navigate(['/profile/',profile.id])
  }

  showGroupContent(groupId: number) {
    if(groupId===undefined){
      groupId = Number(localStorage.getItem('groupId'));
    }else{
      localStorage.setItem('groupId',groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data:any)=>
    { this.currentGroup = data;
      this.editGroupRoom.name=data.name;
      this.editGroupRoom.maxUsers=data.maxUsers;
      this.editGroupRoom.description=data.description;
      this.isUserInGroup = this.tableContains(data?.users,this.currentUser);
      this.profilePictures = this.profilePicturesService.getUsersProfilePictures();

      if(this.profilePictures.size===0){
        this.profilePicturesService.setUsersProfilePictureForGroup(data);
        this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
      }
    },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    )
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if ( this.currentUser?.role.name === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
        this.isUserInGroup = this.tableContains(this.currentGroup?.users,data);
      }, (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }
  public joinGroup(groupId:number){
    this.userService.joinGroup(groupId).subscribe((data:any) => {
        // this.alertService.success('You joined group');
        this.showGroupContent(groupId)
      },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  generateCode(groupRoom:GroupRoom){
    this.groupRoomService.generateCode(groupRoom.id).subscribe((data:any) =>
    { const joinCodedto:JoinCodeDTO = data;
      groupRoom.joinCode = joinCodedto?.code},(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }

  public makePartyLeader(user:User){
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.makePartyLeader(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public removeFromGroup(user:User){
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.removeFromGroup(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table.length;i++){
      if(table[i]?.id === objectToFind?.id){
        found = true;
        break;
      }
    }
    return found
  }

  public setConnection(values:any){
    this.isConnected.set(values[0],values[1]);
  }
  private initializeForm(){
    this.groupEditForm=this.formBuilder.group({
      editGroup: this.formBuilder.group({
        name: new FormControl('',[Validators.required,Validators.minLength(2)]),
        maxUsers: new FormControl('',[Validators.maxLength(5)]),
        desc: new FormControl('',
          [Validators.required,Validators.minLength(2),Validators.maxLength(150)])
      })
    })
  }
  public turnEditMode(){
    console.log(this.currentGroup)

    this.alertService.clear();
    if(this.buttonFunction === 'Edit') {
      //this.enableInputs();
      //this.initializeForm();
      this.isEditOff = false;
      this.buttonFunction = 'Save changes';
    }
    else{
      this.editGroup();
      this.buttonFunction = 'Edit'
      this.isEditOff = true;
      //this.disableInputs();
    }
  }
  public cancelEdit(){
    //this.disableInputs();
    this.buttonFunction='Edit'
    this.isEditOff = true;

  }

  private editGroup() {
    if(this.groupEditForm.valid){
      const groupData = this.createGroupObject();
      this.groupRoomService.editGroup(this.currentGroup.id,groupData)
        .subscribe(
          (data) => {
           // this.router.navigateByUrl('/group-show');
            this.alertService.success('Data updated');
            this.currentGroup.name=data.name;
            this.currentGroup.description=data.description;
            this.currentGroup.maxUsers=data.maxUsers;
          }, (e) => {
            this.alertService.error(CodeErrors.get(e.error.code));
          }
        );
    }else{
      if (this.groupEditForm.get('editGroup').get('name').errors!==null) {
        this.alertService.error('Minimum 2 letters for name')
      }else if(this.groupEditForm.get('editGroup').get('maxUsers').errors!==null){
        this.alertService.error('Max users must be in range of 2 to 5')
      }else if(this.groupEditForm.get('editGroup').get('desc').errors!==null) {
        this.alertService.error('Description must be in range of 5 to 150')
      }
    }
  }
  private createGroupObject(): GroupRoom {

    this.editGroupRoom.name = this.groupEditForm.get('editGroup').get('name').value;
    this.editGroupRoom.maxUsers = this.groupEditForm.get('editGroup').get('maxUsers').value;
    this.editGroupRoom.description = this.groupEditForm.get('editGroup').get('desc').value;
    return this.editGroupRoom;
  }
}
