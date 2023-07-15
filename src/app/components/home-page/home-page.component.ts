import { Component, OnInit } from '@angular/core';
import {GameDTO} from '../../domain/dto/GameDTO';
import {CategoryService} from '../../services/categoryService';
import {Router} from '@angular/router';

import {Store} from "@ngrx/store";
import {selectGamesItems} from "../../core/state/games";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  games:GameDTO[];
  constructor(private categoryService:CategoryService,private router:Router,
              private store:Store) { }

  ngOnInit(): void {
    this.getGames();
  }

  getGames(){
    // this.categoryService.getGames().subscribe(
    //   data => {
    //    this.games = data;
    //    this.categoryService.setAllGames(data);
    //   }
    // )

    this.store.select(selectGamesItems).subscribe(
      data =>{

        this.games = data;
        this.categoryService.setAllGames(data);
      }
    );

  }

  public redirectToChosen(game:GameDTO){
  this.categoryService.setGame(game);
  this.router.navigateByUrl('/dashboard');
  }

}
