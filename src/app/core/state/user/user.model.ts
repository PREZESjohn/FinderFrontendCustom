import {InGameRoles} from '../../../domain/dto/InGameRoles';
import {Platform} from '../../../domain/Platform';
import {Role} from "../../../domain/Role";

export class UserStateDTO{
  public id:number;
  public username:string;
  public name:string;
  public info:string;
  public age:number;
  public email:string;
  public phone:number;
  public city:string;
  public inGameRoles: InGameRoles[];
  public platforms:Platform[];
  public role: Role;
  public profilePicture?: any;
}
