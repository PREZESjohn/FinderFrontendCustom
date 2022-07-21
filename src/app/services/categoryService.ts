import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GameDTO} from '../domain/dto/GameDTO';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Category} from '../domain/Category';

@Injectable({providedIn: 'root'})
export class CategoryService {

  url = 'http://localhost:8080/api/v1/category';
  chosenGame:GameDTO;
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

  getCategoriesByGame(game:string): Observable<Category[]>{
    return this.http.get<Category[]>(this.url+'/all/'+game)
  }
}
