import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TopicResponse } from '../models/DTOs/Responses/topic-response.model';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private http : HttpClient) { }

  readonly getTopic : string = environment.BASE_URL + '/api/v1/get-topic/';
  readonly addTopic : string = environment.BASE_URL + '/api/v1/add-topic';
  readonly getAll = environment.BASE_URL + '/api/v1/get-all-topics'

  async GetTopic (id : number) : Promise<TopicResponse>
  {
    return await this.http.get<TopicResponse>(this.getTopic + id)
      .pipe(take(1))
      .toPromise();
  }
  async AddTopic(topic : Topic) : Promise<TopicResponse>
  {
    return await this.http.post<TopicResponse>(this.addTopic, topic)
      .pipe(take(1))
      .toPromise();
  }
  async GetAllTopics() : Promise<TopicResponse>
  {
    return await this.http.get<TopicResponse>(this.getAll)
      .pipe(take(1))
      .toPromise()
  }
}
