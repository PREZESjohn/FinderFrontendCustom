import {UserDTO} from './dto/UserDTO';

export class Report{
  public id:number;
  public reason:string;
  public reportedBy:UserDTO;
  public reportedUser:UserDTO;
  public date:string;
}
