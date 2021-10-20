import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserTopics } from '../models/DTOs/Requests/usertopic.model';
import { UserTopicResponse } from '../models/DTOs/Responses/usertopicresponse.model';

@Injectable({
  providedIn: 'root'
})
/**
 * This class is the service for the user_topics table.
 * It connects to the 
 */
export class UserTopicsService {
  
  
  constructor(private http:HttpClient) { }

  readonly getTopicsUser : string = environment.BASE_URL + "/api/v1/get-followed-topic-user-id/";
  readonly followTopic : string = environment.BASE_URL + "/api/v1/follow-topic";
  readonly getTopicRel = environment.BASE_URL + '/api/v1/get-topic-relationship/';
  readonly unfollowTopic = environment.BASE_URL + '/api/v1/unfollow-topic/';
  authToken = localStorage.getItem('authtoken');

  async GetFollowedTopicsUser (id : number) : Promise<UserTopicResponse>
  {
    return await this.http.get<UserTopicResponse>(this.getTopicsUser + id, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)})
      .pipe(take(1))
      .toPromise();
  }
  async FollowTopic(obj : UserTopics) : Promise<UserTopicResponse>
  {
    return await this.http.post<UserTopicResponse>(this.followTopic, obj,
      {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authtoken')}`)})
      .pipe(take(1))
      .toPromise();
  }
  async GetRelationship(user:number, topic:number) : Promise<UserTopicResponse>
  {
    return await this.http.get<UserTopicResponse>(this.getTopicRel + topic + ':' + user)
      .pipe(take(1))
      .toPromise();
  }
  async UnfollowTopic(id : number) : Promise<UserTopicResponse>
  {
    return await this.http.delete<UserTopicResponse>(this.unfollowTopic + id)
      .pipe(take(1))
      .toPromise();
  }
}
