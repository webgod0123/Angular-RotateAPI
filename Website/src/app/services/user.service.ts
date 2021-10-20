import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from 'src/environments/environment';

import { User_Response } from '../models/DTOs/Responses/user_response.model';
import { map, take } from 'rxjs/operators';
import { Token } from '../models/token.model';
import jwt_decode from 'jwt-decode';

import { Router } from '@angular/router';
import { Security } from '../models/DTOs/Requests/security.model';
import { BlockedResponse } from '../models/DTOs/Responses/blockedresponse.model';
import { FileValidationService } from './file-validation.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,
              private router : Router,
              private validate : FileValidationService) { }

  readonly get:string = environment.BASE_URL + '/api/v1/get-user/'
  readonly getName = environment.BASE_URL + '/api/v1/get-user-username/'
  readonly update:string = environment.BASE_URL + '/api/v1/update-user/'
  readonly passwordUpdate:string = environment.BASE_URL + '/api/v1/update-user-password/'
  readonly getAllBlocked:string = environment.BASE_URL + '/api/v1/get-all-blocked-users/'
  readonly getBlocked:string = environment.BASE_URL + '/api/v1/get-personal-blocked-users/'
  readonly getAllUsers:string = environment.BASE_URL + '/api/v1/get-all-users'

  async GetUser(id : number) : Promise<User_Response>
  {
    return await this.http.get<User_Response>((this.get + id),
      {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authtoken')}`)})
      .pipe(take(1))
      .toPromise();
  }
  async GetUserName(id : string) : Promise<User_Response>
  {
    return await this.http.get<User_Response>(this.getName + id)
      .pipe(take(1))
      .toPromise();
  }
  GetLoggedInUser(): Token|null
  {
    const authToken = localStorage.getItem('authtoken');
    if (authToken != null) {
      const currentToken = new Token();
      Object.assign(currentToken, JSON.parse(authToken));
      if(this.validate.checkTokenExp(currentToken))
      {
        localStorage.removeItem('authtoken');
        return null;
      }
      return currentToken;
    }
    else {
      return null;
    }
  }
  GetCurrentUserID() : number | null
  {
    const authToken = localStorage.getItem('authtoken');
    if(authToken!=null)
    {
      return jwt_decode<Token>(authToken).Id;
    }
    return null;
  }
  async UpdateUser(id:number, document:any) : Promise<User_Response>
  {
    return await this.http.patch<User_Response>(this.update + id, document)
      .pipe(take(1))
      .toPromise();
  }
  async UpdateUserPassword(id:number, sec:Security) : Promise<User_Response>
  {
    return await this.http.patch<User_Response>(this.passwordUpdate + id, sec)
      .pipe(take(1))
      .toPromise();
  }
  async GetAllBlockedUsers(id : number) : Promise<BlockedResponse>
  {
    return await this.http.get<BlockedResponse>(this.getAllBlocked + id)
      .pipe(take(1))
      .toPromise();
  }
  GetAllUsers() : Observable<User_Response>
  {
    return this.http.get<User_Response>(this.getAllUsers);
  }
}
