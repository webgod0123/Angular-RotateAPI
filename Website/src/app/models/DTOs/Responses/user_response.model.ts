import { User } from "src/app/models/user.model";

export class User_Response
{
    user : User;
    users : User[];
    errors : string[];
    success : boolean;
}