import { Token } from "../../token.model";

export class RegistrationResponse
{
    token : string;
    success : boolean;
    errors : string[];
}