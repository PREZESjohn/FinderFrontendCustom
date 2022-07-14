import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GameDTO} from '../domain/dto/GameDTO';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';

@Injectable({providedIn: 'root'})
export class CategoryService {

  url = 'http://localhost:8080/api/v1/category';
  chosenGame:string
  constructor(private http: HttpClient) {
  }

  getGames(): Observable<GameDTO[]> {
    return this.http.get<GameDTO[]>(this.url);
  }

  setGame(game){
    this.chosenGame = game;
  }
  getGame(){
    return this.chosenGame;
  }
}
