import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {ReportedUser} from '../../domain/ReportedUser';
import {CodeErrors} from '../../providers/CodeErrors';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-support-panel',
  templateUrl: './support-panel.component.html',
  styleUrls: ['./support-panel.component.scss']
})
export class SupportPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
