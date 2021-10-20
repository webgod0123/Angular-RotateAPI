import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import jwt_decode from 'jwt-decode';
import { Token } from '../models/token.model';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/DTOs/Requests/user-login.model';
import { environment } from 'src/environments/environment';
import { RegistrationResponse } from '../models/DTOs/Responses/registrationresponse.model';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmailRequest } from '../models/DTOs/Requests/email-request.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() UserStateChanged = new EventEmitter<boolean>();
  
  constructor(private http:HttpClient, private router:Router) { }

  formData:UserLogin = new UserLogin();
  readonly verify:string = environment.BASE_URL + '/api/v1/login-user';
  readonly create:string = environment.BASE_URL + '/api/v1/register-user';
  readonly sendEmail = environment.BASE_URL + '/api/v1/send-email';
  readonly verifyEmail = environment.BASE_URL + '/api/v1/verify-email/';

  getLocation()
  {
    this.formData.device = navigator.userAgent;
    navigator.geolocation.getCurrentPosition(p =>
      {
        this.formData.longitude = p.coords.longitude;
        this.formData.latitude = p.coords.latitude;
      });
  }
  async checkUser(): Promise<RegistrationResponse>
  {
      this.getLocation();
      return await this.http.post<RegistrationResponse>(this.verify, this.formData)
        .pipe(take(1))
        .toPromise();
  }
  async postUser() : Promise<RegistrationResponse>
  {
      this.getLocation();
      return await this.http.post<RegistrationResponse>(this.create, this.formData)
        .pipe(take(1))
        .toPromise();
  }
  async SendEmail(email : EmailRequest) : Promise<RegistrationResponse>
  {
    return await this.http.post<RegistrationResponse>(this.sendEmail, email)
      .pipe(take(1))
      .toPromise();
  }
  async VerifyEmail(id : string) : Promise<RegistrationResponse>
  {
    return await this.http.get<RegistrationResponse>(this.verifyEmail + id)
      .pipe(take(1))
      .toPromise();
  }
 SetLoggedInUser(currentToken: string)
  {
      const decodedToken = jwt_decode<Token>(currentToken);
      const userToken = new Token();

      userToken.Id = decodedToken.Id;
      userToken.iat = decodedToken.iat;
      userToken.exp = decodedToken.exp;
      userToken.sub = decodedToken.sub;
      userToken.token = currentToken;

      localStorage.setItem('authtoken', JSON.stringify(userToken));
      this.UserStateChanged.emit(true);
  }
  LogOutUser(): void
  {
    localStorage.removeItem('authtoken');
    this.UserStateChanged.emit(false);
  }
}
