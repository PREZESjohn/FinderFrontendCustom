import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';
import {GroupRoom} from '../../domain/GroupRoom';
import {CategoryService} from '../../services/categoryService';
import {Category} from '../../domain/Category';
import {GameDTO} from '../../domain/dto/GameDTO';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

  groupAddFormGroup: FormGroup;
  fieldTextType: boolean;
  chosenGame = '';
  chosenCategory:Category;
  categories: Category[];
  games:any;  //TODO zrobic cos z tym zeby nie pobierac w kazdym komponencie tego bo wstyd

  //TODO zrobic cos z maxUsers bo jesli nie zmieni się kategorii to nie ustawi wartosci dla zmiennej
  constructor(private groupRoomService: GroupRoomService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private categoryService:CategoryService) {
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
          [Validators.required, Validators.minLength(2)]),
        game:new FormControl(this.chosenGame,),
        category:new FormControl(this.chosenCategory),
        maxUsers:new FormControl(this.chosenCategory?.basicMaxUsers,Validators.maxLength(5)),
        description: new FormControl('',[Validators.required, Validators.minLength(2)])
      })
    });
    console.log(this.chosenCategory?.basicMaxUsers)
    this.groupAddFormGroup.get('newGroup').get("game").disable();
  }

  public loadCategoriesByGame(gameName:string){
    this.categoryService.getCategoriesByGame(gameName).subscribe((data:any)=>{
      this.categories = data;
      this.chosenCategory = data[0];
      },()=>{
        this.alertService.error("Error while getting categories");}
    );
    }

  public addGroupRoom() {
    this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers,{onlySelf:true})
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
    groupRoom.category = this.chosenCategory;
    groupRoom.maxUsers = this.groupAddFormGroup.get('newGroup').get('maxUsers').value;

    // const temp = this.games.map(a =>{ if(a.name === this.chosenGame){return a}else return
    // }).filter((value)=>{return value !== undefined});
    // groupRoom.game = temp[0];

    return groupRoom;
  }

  public changeCategory(e){
    const temp = this.categories.map(a =>{ if(a.name === e.target.value){return a}else return
    }).filter((value)=>{return value !== undefined});
    this.chosenCategory = temp[0];
    console.log(this.chosenCategory)
   this.groupAddFormGroup.get('newGroup').get('category').setValue(e.target.value,{onlySelf:true});
   console.log(this.chosenCategory?.basicMaxUsers)
   this.groupAddFormGroup.get('newGroup').get('maxUsers').setValue(this.chosenCategory?.basicMaxUsers,{onlySelf:true})
  }
}
