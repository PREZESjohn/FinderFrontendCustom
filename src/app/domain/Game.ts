import {InGameRoles} from './dto/InGameRoles';
import {Category} from './Category';
import {GroupRoom} from "./GroupRoom";

export class Game{
  id:number;
  name:string;
  inGameRoles: InGameRoles[]
  categories:Category[];
  assignRolesActive:boolean;
  groupRooms: GroupRoom[];
}
