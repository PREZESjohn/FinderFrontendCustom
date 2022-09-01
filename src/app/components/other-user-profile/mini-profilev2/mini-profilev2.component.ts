import {Component, Inject, Injectable, Input, OnInit} from '@angular/core';
import {UserPreviewOverlayRef} from "./user-preview-overlay-ref";
import {USER_PREVIEW_DIALOG_DATA} from "./user-preview-overlay.tokens";
import {User} from "../../../domain/User";

import {UserService} from "../../../services/user.service";
import {ProfilePicturesService} from "../../../services/profilePicturesService";
import {CategoryService} from "../../../services/categoryService";
import {GameDTO} from "../../../domain/dto/GameDTO";

@Component({
  selector: 'mini-profilev2',
  templateUrl: `./mini-profilev2.component.html`,
  styleUrls: ['./mini-profilev2.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class MiniProfilev2Component implements OnInit{

  usersProfilePictures = new Map();
  games:GameDTO[];
  constructor(
    private userService: UserService,
    private profilePictureService: ProfilePicturesService,
    private categoryService:CategoryService,
    public dialogRef: UserPreviewOverlayRef, @Inject(USER_PREVIEW_DIALOG_DATA) public user: User) {
  }

  ngOnInit(): void {
    this.usersProfilePictures=this.profilePictureService.getUsersProfilePictures();
    this.games=this.categoryService.getAllGames()
  }
  tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table?.length;i++){
      if(table[i].id === objectToFind.id){
        found = true;
        break;
      }
    }
    return found
  }

}
