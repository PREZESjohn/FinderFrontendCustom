import {InGameRoles} from '../../../domain/dto/InGameRoles';
import {Platform} from '../../../domain/Platform';
import {Role} from "../../../domain/Role";
import {GroupRoom} from "../../../domain/GroupRoom";

export class UserStateDTO{
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
  public platforms:Platform[];
  public profilePicture?: any;
}
