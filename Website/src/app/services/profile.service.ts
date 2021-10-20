import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfileResponse } from '../models/DTOs/Responses/profileresponse.model';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http:HttpClient) { }

  readonly addPfp = environment.BASE_URL + "/api/v1/add-pfp/"
  readonly addBanner = environment.BASE_URL + '/api/v1/add-banner/'
  readonly createProfile = environment.BASE_URL + "/api/v1/new-profile"
  readonly getProfile = environment.BASE_URL + "/api/v1/get-profile/"
  readonly updateProfile = environment.BASE_URL + "/api/v1/update-profile/"

  async NewProfile(profile : Profile)
  {
    await this.http.post(this.createProfile, profile)
      .pipe(take(1))
      .toPromise();
  }
  async GetProfile(id : number) : Promise<ProfileResponse>
  {
    return this.http.get<ProfileResponse>(this.getProfile + id)
      .pipe(take(1))
      .toPromise();
  }
  async AddPfp(id : number, data:any) : Promise<ProfileResponse>
  {
    return await this.http.put<ProfileResponse>(this.addPfp + id, data)
      .pipe(take(1))
      .toPromise();
  }
  async AddBanner(id : number, data:any) : Promise<ProfileResponse>
  {
    return await this.http.put<ProfileResponse>(this.addBanner + id, data)
      .pipe(take(1))
      .toPromise();
  }
  async UpdateProfile(id:number, patch:any) : Promise<ProfileResponse>
  {
    return await this.http.patch<ProfileResponse>(this.updateProfile + id, patch)
      .pipe(take(1))
      .toPromise();
  }
}
