import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Interaction } from '../models/DTOs/Responses/interaction.model';
import { InteractionResponse } from '../models/DTOs/Responses/interactionresponse.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor(private http : HttpClient) { }
  readonly addInter = environment.BASE_URL + "/api/v1/add-interaction"
  readonly getRel = environment.BASE_URL + "/api/v1/get-interactions/"
  readonly getCount = environment.BASE_URL + "/api/v1/get-interaction-count/"
  readonly removeInter = environment.BASE_URL + "/api/v1/remove-interaction/"

  async AddInteraction(obj : Interaction) : Promise<InteractionResponse>
  {
    return await this.http.post<InteractionResponse>(this.addInter, obj)
      .pipe(take(1))
      .toPromise();
  }
  async GetInteractions(post_id : string, user_id:number) : Promise<InteractionResponse>
  {
    return await this.http.get<InteractionResponse>(this.getRel + post_id + ':' + user_id)
      .pipe(take(1))
      .toPromise()
  }
  async GetCount (post_id : string, type : number) : Promise<InteractionResponse>
  {
    return await this.http.get<InteractionResponse>(this.getCount + post_id + ':' + type)
      .pipe(take(1))
      .toPromise()
  }
  async RemoveInteraction(id : string) : Promise<InteractionResponse>
  {
    return await this.http.delete<InteractionResponse>(this.removeInter + id)
      .pipe(take(1))
      .toPromise()
  }
}
