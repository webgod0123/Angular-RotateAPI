import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { bug } from '../models/bug.model';
import { BugResponse } from '../models/DTOs/Responses/bugresponse.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {

  constructor(private http:HttpClient) { }
  readonly sendReport = environment.BASE_URL + '/api/v1/send-bug-report';

  async SendReport(bug : bug) : Promise<BugResponse>
  {
    return await this.http.post<BugResponse>(this.sendReport, bug)
      .pipe(take(1))
      .toPromise();
  }
}
