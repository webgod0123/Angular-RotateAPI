import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SurveyResponse } from '../models/DTOs/Responses/survey-response.model';
import { Survey } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http : HttpClient) { }

  readonly addSurvey = environment.BASE_URL + '/api/v1/new-survey'
  readonly getSurvey = environment.BASE_URL + '/api/v1/get-survey/'

  async NewSurvey (survey : Survey) : Promise<SurveyResponse>
  {
    return await this.http.post<SurveyResponse>
      (this.addSurvey, survey)
      .pipe(take(1))
      .toPromise();
  } // end function

  async GetSurvey (id : number) : Promise<SurveyResponse>
  {
    return await this.http.get<SurveyResponse>
      (this.getSurvey + id)
      .pipe(take(1))
      .toPromise();
  } // end function

} // end class
