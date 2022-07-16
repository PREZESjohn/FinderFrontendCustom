import {GroupRoom} from './GroupRoom';
import {Role} from "./Role";
import {InGameRoles} from './dto/InGameRoles';

export class User {
  public id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  public groupRooms: GroupRoom[];
  public role: Role;
  public inGameRoles: InGameRoles[];
}
