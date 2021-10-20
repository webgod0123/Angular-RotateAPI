import { UserSetting } from "../../user-setting,model";

export class UserSettingResponse
{
    settings : UserSetting;
    errors : string[];
    success : boolean;
}