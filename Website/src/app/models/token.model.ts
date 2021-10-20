import { User } from './user.model';


export class Token {
  token = '';
  Id! : number;
  UserData!: User;
  iat!: number;
  exp!: number;
  sub!: string;

}
