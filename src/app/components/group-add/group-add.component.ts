import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';
import {GroupRoom} from '../../domain/GroupRoom';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

  groupAddFormGroup: FormGroup;
  fieldTextType: boolean;

  constructor(private groupRoomService: GroupRoomService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.groupAddFormGroup = this.formBuilder.group({
      newGroup: this.formBuilder.group({
        name: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        description: new FormControl('',[Validators.required, Validators.minLength(2)])
      })
    });
  }
  public addGroupRoom() {
    const newGroup = this.createGroupRoomObject();
    this.groupRoomService.addGroup(newGroup)
        .subscribe(
          () => {
            this.router.navigateByUrl('/dashboard');
          }, () => {
            this.alertService.error('Something went wrong! Try again');
          }
        );
  }

  private createGroupRoomObject(): GroupRoom {
    const groupRoom = new GroupRoom();
    groupRoom.name = this.groupAddFormGroup.get('newGroup').get('name').value;
    groupRoom.description = this.groupAddFormGroup.get('newGroup').get('description').value;

    return groupRoom;
  }
}
