import { Component, OnInit } from '@angular/core';
import {GroupRoom} from '../../../domain/GroupRoom';
import {GroupRoomService} from '../../../services/group-room.service';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-main-page',
  templateUrl: './admin-main-page.component.html',
  styleUrls: ['./admin-main-page.component.scss']
})
export class AdminMainPageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


}
