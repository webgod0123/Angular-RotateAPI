import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserFollowers } from '../models/DTOs/Requests/userfollower.model';
import { UserFollowerResponse } from '../models/DTOs/Responses/userfollowerresponse.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserFollowerServiceService {

  constructor(private http:HttpClient) { }

  readonly getFollowedUrl = environment.BASE_URL  + '/api/v1/get-followed-users/'
  readonly followUser = environment.BASE_URL + '/api/v1/follow-user'
  readonly unfollowUser = environment.BASE_URL + '/api/v1/unfollow-user/'
  readonly getRel = environment.BASE_URL + '/api/v1/get-relationship/'
  readonly getCount = environment.BASE_URL + '/api/v1/follower-count/';
  readonly getFollowers = environment.BASE_URL + '/api/v1/get-followers/'

  async GetFollowedUsers (id : number) : Promise<UserFollowerResponse>
  {
    return await this.http.get<UserFollowerResponse>(this.getFollowedUrl + id, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authtoken')}`)})
      .pipe(take(1))
      .toPromise();
  }
  async FollowUser(obj : UserFollowers) : Promise<UserFollowerResponse>
  {
    return await this.http.post<UserFollowerResponse>(this.followUser, obj, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authtoken')}`)})
      .pipe((take(1)))
      .toPromise();
  }
  async UnfollowUser(id : string) : Promise<UserFollowerResponse>
  {
    return await this.http.delete<UserFollowerResponse>(this.unfollowUser + id)
      .pipe(take(1))
      .toPromise()
  }
  async GetRelationship(id : number, id2 : number) : Promise<UserFollowerResponse>
  {
    return await this.http.get<UserFollowerResponse>(this.getRel + id + ':' + id2)
      .pipe(take(1))
      .toPromise();
  }
  async GetFollowerCount(id : number) : Promise<UserFollowerResponse>
  {
    return await this.http.get<UserFollowerResponse>(this.getCount + id)
      .pipe(take(1))
      .toPromise();
  }
  async GetFollowers(id : number) : Promise<UserFollowerResponse>
  {
    return await this.http.get<UserFollowerResponse>(this.getFollowers + id)
      .pipe(take(1))
      .toPromise();
  }
}
