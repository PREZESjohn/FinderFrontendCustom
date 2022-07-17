import {GroupRoom} from './GroupRoom';
import {Role} from "./Role";
import {InGameRoles} from './dto/InGameRoles';

export class User {
  public id: number;
  public username: string;
  public password: string;
  public email: string;
  public name: string;
  public info:string;
  public age:number;
  public city:string;
  public phone:number;
  public groupRooms: GroupRoom[];
  public role: Role;
  public inGameRoles: InGameRoles[];
}
