import { DatePipe } from "@angular/common";
import { User } from "../../user.model";

export class UserLogin extends User
{
    device:string;
    longitude:number;
    latitude:number;
}
