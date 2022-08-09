import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GameDTO} from '../domain/dto/GameDTO';
import {GroupRoom} from '../domain/GroupRoom';
import {Category} from '../domain/Category';
import { Observable, Subject } from 'rxjs';
@Injectable({providedIn: 'root'})
export class CategoryService {

  url = 'http://localhost:8080/api/v1/category';
  chosenGame:GameDTO;
  private gameSubject = new Subject<any>();
  allGames:GameDTO[];
  constructor(private http: HttpClient) {
  }

  getGames(): Observable<GameDTO[]> {
    return this.http.get<GameDTO[]>(this.url);
  }

  setGame(game){
    this.chosenGame = game;
    this.gameSubject.next(game);
  }
  getGame(){
    return this.chosenGame;
  }

  setAllGames(games){
    this.allGames = games
    this.chosenGame = games[0]
  }

  getAllGames(){
    return this.allGames;
  }

  getCategoriesByGame(game:string): Observable<Category[]>{
    return this.http.get<Category[]>(this.url+'/all/'+game)
  }
  lookForUpdate():Observable<any>{
    return this.gameSubject.asObservable();
  }
}
