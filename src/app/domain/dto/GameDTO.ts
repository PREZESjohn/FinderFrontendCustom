import {InGameRoles} from './InGameRoles';
import {Category} from '../Category';

export class GameDTO{
  id:number;
  name:string;
  inGameRoles: InGameRoles[]
  categories:Category[];
}
