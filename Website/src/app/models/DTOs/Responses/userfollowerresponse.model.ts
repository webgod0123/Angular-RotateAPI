import { UserFollowers } from "../Requests/userfollower.model";

export class UserFollowerResponse
{
    userFollower : UserFollowers;
    userList: number[];
    count : number;
    followed : boolean;
    success : boolean;
    errors : string[];
}