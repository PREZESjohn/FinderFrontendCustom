import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {CategoryService} from "../../../services/categoryService";
import {GameDTO} from "../../../domain/dto/GameDTO";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {

  gameDetailsFormGroup: FormGroup;
  editGame= new GameDTO();
  edit=false;


  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private alertService: AlertService,
               private categoryService:CategoryService,
               @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
    this.initializeForm()
  }
  initializeForm(){
    this.gameDetailsFormGroup = this.formBuilder.group({
      newGroup: this.formBuilder.group({
        name: new FormControl(this.data.game.name,[Validators.required]),
        category:new FormControl(''),
        canAssingRoles: new FormControl(this.data.game.assignRolesActive),
        assignRoles: new FormControl(''),

        })
    });
    this.gameDetailsFormGroup.get('newGroup').get('name').disable();
    this.gameDetailsFormGroup.get('newGroup').get('category').disable();
    this.gameDetailsFormGroup.get('newGroup').get('canAssingRoles').disable();
    this.gameDetailsFormGroup.get('newGroup').get('assignRoles').disable();
  }

  changeCategory($event: Event) {

  }

  setRole(role: any) {

  }
}
