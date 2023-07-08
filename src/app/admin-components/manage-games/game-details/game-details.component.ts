import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {CategoryService} from "../../../services/categoryService";
import {GameDTO} from "../../../domain/dto/GameDTO";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../../domain/Category";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {

  gameDetailsFormGroup: FormGroup;
  editGame= new GameDTO();
  edit=false;
  canAssignRoles=true;

  dataSource: MatTableDataSource<Category>;
  public displayedColumns=['id','name','basicMaxUsers','canAssignRoles']

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private alertService: AlertService,
               private categoryService:CategoryService,
               @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource=new MatTableDataSource<Category>(this.data.game.categories);
    this.canAssignRoles=this.data.game.assignRolesActive;

  }

  ngOnInit(): void {
    this.initializeForm()
  }
  initializeForm(){
    this.gameDetailsFormGroup = this.formBuilder.group({
      newGroup: this.formBuilder.group({
        name: new FormControl(this.data.game.name,[Validators.required]),
        category:new FormControl(''),
        canAssignRoles: new FormControl(this.data.game.assignRolesActive),
        assignRoles: new FormControl(''),

        })
    });
    this.gameDetailsFormGroup.get('newGroup').get('name').disable();
    this.gameDetailsFormGroup.get('newGroup').get('category').disable();
    this.gameDetailsFormGroup.get('newGroup').get('canAssignRoles').disable();
    this.gameDetailsFormGroup.get('newGroup').get('assignRoles').disable();
  }


  setRole(role: any) {

  }

  changeEditMode() {
    if(this.edit){
      this.gameDetailsFormGroup.get('newGroup').enable();
    }
    else {
      this.gameDetailsFormGroup.get('newGroup').disable();
    }
  }
}
