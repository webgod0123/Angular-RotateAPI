import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserSettingResponse } from '../models/DTOs/Responses/user-setting-response.model';
import { UserSetting } from '../models/user-setting,model';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {

  constructor(private http : HttpClient) { }

  readonly addSettings = environment.BASE_URL + '/api/v1/new-settings';
  readonly getSettings = environment.BASE_URL + '/api/v1/get-settings/';
  readonly updateSettings = environment.BASE_URL + '/api/v1/update-settings/'

  async AddSettings (setting : UserSetting) : Promise<UserSettingResponse>
  {
    return await this.http.post<UserSettingResponse>(this.addSettings, setting)
      .pipe(take(1))
      .toPromise();
  }
  async GetSettings(id : number) : Promise<UserSettingResponse>
  {
    return await this.http.get<UserSettingResponse>(this.getSettings + id)
      .pipe(take(1))
      .toPromise()
  }
  async UpdateSettings(id : number,  patch : any) : Promise<UserSettingResponse>
  {
    return await this.http.patch<UserSettingResponse>(this.updateSettings + id, patch)
      .pipe(take(1))
      .toPromise();
  }
}
