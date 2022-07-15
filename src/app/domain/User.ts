import {GroupRoom} from './GroupRoom';
import {Role} from "./Role";
import {InGameRolesDTO} from './dto/InGameRolesDTO';

export class User {
  public id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  public groupRooms: GroupRoom[];
  public role: Role;
  public inGameRoles: InGameRolesDTO[];
}
