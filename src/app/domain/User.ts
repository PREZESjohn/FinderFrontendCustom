import {GroupRoom} from './GroupRoom';
import {Role} from "./Role";

export class User {
  public id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  public groupRooms: GroupRoom[];
  public role: Role;
}
