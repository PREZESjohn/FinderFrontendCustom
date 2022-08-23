import {User} from "./User";
import {Message} from "./Message";
import {Category} from './Category';
import {GameDTO} from './dto/GameDTO';
export class GroupRoom{
  public id: number;
  public name: string;
  public description: string;
  public maxUsers:number;
  public open:boolean;
  public users: User[];
  public groupLeader: User;
  public chat: Message[];
  public category:Category;
  public game:GameDTO;
  public city:string;
  public joinCode:string;
}
