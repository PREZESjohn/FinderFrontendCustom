import {User} from "./User";
import {Comment} from "./Comment";
export class GroupRoom{
  public id: number;
  public name: string;
  public description: string;
  public users: User[];
  public groupLeader: User;
  public comments: Comment[];
}
