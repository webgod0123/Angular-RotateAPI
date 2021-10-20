import { User } from "../../user.model";

export class BlockedResponse
{
    blocked : string;
    blockedUsers : User[];
    success : boolean;
    errors : string [];
}