import {Component, Inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GroupRoom} from "../../../domain/GroupRoom";
import {CodeErrors} from "../../../providers/CodeErrors";
import {GroupRoomService} from "../../../services/group-room.service";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  groupEditForm: FormGroup;
  editGroupRoom = new GroupRoom();

  constructor(private groupRoomService: GroupRoomService,
              private router:Router,
              private alertService:AlertService,
              private formBuilder:FormBuilder,
              private dialogRef: MatDialogRef<EditGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
    this.groupEditForm=this.formBuilder.group({
      editGroup: this.formBuilder.group({
        name: new FormControl(this.data.groupRoom.name,[Validators.required,Validators.minLength(2)]),
        maxUsers: new FormControl(this.data.groupRoom.maxUsers,[Validators.maxLength(5)]),
        desc: new FormControl(this.data.groupRoom.desc,
          [Validators.required, Validators.minLength(2), Validators.maxLength(150)])
      })
    })
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
        this.alertService.error('Minimum 2 letters for name')
      } else if (this.groupEditForm.get('editGroup').get('maxUsers').errors !== null) {
        this.alertService.error('Max users must be in range of 2 to 5')
      } else if (this.groupEditForm.get('editGroup').get('desc').errors !== null) {
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
