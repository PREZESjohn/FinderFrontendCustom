import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';
import {GroupRoom} from '../../domain/GroupRoom';
import {CategoryService} from '../../services/categoryService';
import {Category} from '../../domain/Category';
import {GameDTO} from '../../domain/dto/GameDTO';
import {cityList} from '../../providers/Cities';
import {InGameRoles} from '../../domain/dto/InGameRoles';
import {TakenInGameRole} from '../../domain/TakenInGameRole';
@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

  groupAddFormGroup: FormGroup;
  fieldTextType: boolean;
  chosenGame:GameDTO;
  chosenCategory:Category;
  categories: Category[];
  cities;
  city;
  isOpen = true;
  tempRole:InGameRoles;
  isActivated = false;
  partnerRole;
  games:any;
  // TODO zrobic cos z tym zeby nie pobierac w kazdym komponencie tego bo wstyd

  constructor(private groupRoomService: GroupRoomService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private categoryService:CategoryService) {
  this.cities = cityList;
  this.city = cityList[0].name
  }

  ngOnInit(): void {
    this.games = this.categoryService.getGames();
    this.chosenGame=this.categoryService.getGame();
    this.loadCategoriesByGame(this.chosenGame);
    this.initializeForm()
  }

  initializeForm(){
    this.groupAddFormGroup = this.formBuilder.group({
      newGroup: this.formBuilder.group({
        name: new FormControl('',
          [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9.,\\s]{3,30}$')]),
        game:new FormControl(this.chosenGame?.name,),
        category:new FormControl(this.chosenCategory),
        city:new FormControl(this.city),
        maxUsers:new FormControl(this.chosenCategory?.basicMaxUsers,[Validators.min(2),Validators.max(10)]),
        description: new FormControl('',[Validators.required, Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9.,\\s]{3,150}$')])
      })
    });
    this.groupAddFormGroup.get('newGroup').get('game').disable();
  }

  public loadCategoriesByGame(game:GameDTO){
    this.categoryService.getCategoriesByGame(game.name).subscribe((data:any)=>{
      this.categories = data;
      this.chosenCategory = data[0];
      },()=>{
        this.alertService.error('Error while getting categories');}
    );
    }

  public addGroupRoom() {
    if(this.groupAddFormGroup.get('newGroup').get('maxUsers').value == null) {
      this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers, {onlySelf: true})
    }
    const newGroup = this.createGroupRoomObject();
    if(this.groupAddFormGroup.valid){
      this.groupRoomService.addGroup(newGroup)
        .subscribe(
          (data:any) => {
            console.log(data)
            this.router.navigate(['/group-show/',data.id])
          }, () => {
            this.alertService.error('Something went wrong! Try again');
          }
        );
    }else{
      this.alertService.error("Wrong group data");
    }

  }

  private createGroupRoomObject(): GroupRoom {
    const groupRoom = new GroupRoom();
    groupRoom.name = this.groupAddFormGroup.get('newGroup').get('name').value;
    groupRoom.description = this.groupAddFormGroup.get('newGroup').get('description').value;
    groupRoom.category = this.chosenCategory;
    groupRoom.maxUsers = this.groupAddFormGroup.get('newGroup').get('maxUsers').value;
    groupRoom.game = this.chosenGame;
    groupRoom.city = this.city;
    groupRoom.open = this.isOpen;
    groupRoom.inGameRolesActive = this.isActivated;

    const takenInGameRole = new TakenInGameRole();
    takenInGameRole.inGameRole = this.tempRole;
    const partnerRole = new TakenInGameRole();
    partnerRole.inGameRole = this.partnerRole;
    groupRoom.takenInGameRoles = [takenInGameRole,partnerRole];
    console.log(groupRoom)

    return groupRoom;
  }

  togglePrivate(){
    this.isOpen = !this.isOpen;
  }

  toggleYes(){
    this.isActivated = !this.isActivated;
    if(this.isActivated) {
      this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory.basicMaxUsers);
      this.groupAddFormGroup.get('newGroup').get('maxUsers').disable();
    }else{
      this.groupAddFormGroup.get('newGroup').get('maxUsers').enable();
    }
  }

  setRole(role){
    this.tempRole = role;
  }
  setPartnerRole(role){
    this.partnerRole = role;
  }

  public changeCategory(e){
    const temp = this.categories.map(a =>{ if(a.name === e.target.value){return a}else return
    }).filter((value)=>{return value !== undefined});
    this.chosenCategory = temp[0];
   this.groupAddFormGroup.get('newGroup').get('category').setValue(e.target.value,{onlySelf:true});
   this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers,{onlySelf:true})
  }

  public changeCity(e){
    const temp = this.cities.map(a =>{ if(a.name === e.target.value){return a}else return
    }).filter((value)=>{return value !== undefined});
    this.city = temp[0];
    this.groupAddFormGroup.get('newGroup').get('city').setValue(e.target.value,{onlySelf:true});
    this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers,{onlySelf:true})
  }
}
