import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GroupRoom} from "../../../domain/GroupRoom";
import {CodeErrors} from "../../../providers/CodeErrors";
import {GroupRoomService} from "../../../services/group-room.service";
import {range} from "rxjs";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  groupEditForm: FormGroup;
  editGroupRoom = new GroupRoom();
  isGameRolesActive=false;
  possibleUsersCount;

  constructor(private groupRoomService: GroupRoomService,
              private router:Router,
              private alertService:AlertService,
              private formBuilder:FormBuilder,
              private dialogRef: MatDialogRef<EditGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
    this.isGameRolesActive=this.data.groupRoom.activeRoles

    this.groupEditForm=this.formBuilder.group({
      editGroup: this.formBuilder.group({
        name: new FormControl(this.data.groupRoom.name,[Validators.required,Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9.,\\s]{3,30}$')]),
        maxUsers: new FormControl(this.data.groupRoom?.maxUsers,[Validators.min(2),Validators.max(10)]),
        desc: new FormControl(this.data.groupRoom.desc,
          [Validators.required, Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9.,\\s]{3,150}$')])
      })
    })
    if(this.isGameRolesActive){
      this.groupEditForm.get("editGroup").get("maxUsers").disable();
    }else{
      this.groupEditForm.get("editGroup").get("maxUsers").enable();
      let temp= [];
      for(let x=this.data.groupRoom.usersInGroup; x<=10; x++){
        temp.push(x)
      }
      this.possibleUsersCount=temp;
    }
  }

  changeGroup() {
    if (this.groupEditForm.valid) {
      const groupData = this.createGroupObject();
      this.groupRoomService.editGroup(this.data.groupRoom.id, groupData)
        .subscribe(
          (data) => {
            this.alertService.success('Group updated');
            const sendData={mode: true, name: groupData.name, maxUsers: groupData.maxUsers, desc: groupData.description}
            this.dialogRef.close(sendData);
          }, (e) => {
            this.alertService.error(CodeErrors.get(e.error.code));
          }
        );
    } else {
      if (this.groupEditForm.get('editGroup').get('name').errors !== null) {
        this.alertService.error('Minimum 3 Alfa-Numerical characters for name')
      } else if (this.groupEditForm.get('editGroup').get('maxUsers').errors !== null) {
        this.alertService.error('Max users must be in range of 2 to 10')
      } else if (this.groupEditForm.get('editGroup').get('desc').errors !== null) {
        this.alertService.error('Description must be in range of 3 to 150 and characters must be Alfa-Numerical')
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
