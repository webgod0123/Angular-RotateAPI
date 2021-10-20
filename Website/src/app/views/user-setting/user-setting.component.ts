import { Component, OnInit } from '@angular/core';
import { UserSettingResponse } from 'src/app/models/DTOs/Responses/user-setting-response.model';
import { UserSetting } from 'src/app/models/user-setting,model';
import { UserSettingService } from 'src/app/services/user-setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {
  page : number = 0;
  constructor(private setting_svc : UserSettingService,
              private user_svc : UserService) { }
  
  user_id : number = this.user_svc.GetCurrentUserID()!;
  settings : UserSetting;
  async ngOnInit() 
  {
    await this.GetSettings();
    await this.NewSettings();
  }

  public SwitchPage(pg : number)
  {
    this.page = pg;
  }
  async GetSettings()
  {
    await this.setting_svc.GetSettings(this.user_id).then(
      (data:UserSettingResponse) =>
      {
        this.settings = data.settings
      },
      (error:UserSettingResponse) =>
      {
        console.error(error)
      } 
    )
  }
  async NewSettings()
  {
    if(this.settings == null)
    {
      var new_setting = new UserSetting()
      new_setting.userID = this.user_id
      await this.setting_svc.AddSettings(new_setting).then(
        (data:UserSettingResponse) =>
        {
          
        },
        (error:UserSettingResponse) =>
        {
          console.error(error);
        }
      )
    }
  }
}
