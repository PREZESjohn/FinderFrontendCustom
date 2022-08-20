import {User} from '../User';

export class MessageLogsDTO{
  public id:number;
  public text:string;
  public user:User;
  public time:string;
  public groupName:string;
}
