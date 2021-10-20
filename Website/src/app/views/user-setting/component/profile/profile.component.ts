import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserSettingResponse } from 'src/app/models/DTOs/Responses/user-setting-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { UserSetting } from 'src/app/models/user-setting,model';
import { User } from 'src/app/models/user.model';
import { UserSettingService } from 'src/app/services/user-setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private user_svc : UserService,
              private setting_svc : UserSettingService) { }

  userID  : number = this.user_svc.GetCurrentUserID()!;
  user : User;

  settings : UserSetting;

  async ngOnInit()
  {
    await this.GetUser();
    await this.GetSettings();
  } // end init

  async GetUser()
  {
    await this.user_svc.GetUser(this.userID).then(
      (data:User_Response) =>
      {
        this.user = data.user; 
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    )
  } // end function

  async GetSettings()
  {
    await this.setting_svc.GetSettings(this.userID).then(
      (data:UserSettingResponse) =>
      {
        this.settings = data.settings
      },
      (error:UserSettingResponse) =>
      {
        console.error(error);
      }
    )
  } // end function

  async Submit(form:NgForm)
  {
    
    var patch_user = [
      {op:"test", path:"/userID", value: this.userID.toString()},
      {op:"replace", path:"/private", value: this.user.private}
    ]
    var patch_settings = [
      {op:"test", path:"/userID", value: this.userID.toString()},
      {op:"replace", path:"/hideBipartisan", value: this.settings.hideBipartisan}
    ]
    await this.user_svc.UpdateUser(this.userID, patch_user).then(
      (data:User_Response) =>
      {
        this.user = data.user;
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    )
    await this.setting_svc.UpdateSettings(this.userID, patch_settings).then(
      (data:UserSettingResponse) =>
      {
        this.settings = data.settings;
        console.log(data);
      },
      (error : UserSettingResponse) =>
      {
        console.error(error);
      }
    )
  }
} // end class
