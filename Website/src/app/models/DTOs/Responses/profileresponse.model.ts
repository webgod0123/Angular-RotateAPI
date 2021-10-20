import { Profile } from "../../profile.model";

export class ProfileResponse 
{
    profile : Profile;
    success : boolean;
    errors : string[];
}