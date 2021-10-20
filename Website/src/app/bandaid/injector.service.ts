import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Token } from '../models/token.model';
import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';

/**
 * This class is our current solution to adding the token to requests.
 * What it does is it interecpts HTTP requests and attaches the token to
 * them with the correct formatting.
 */
@Injectable()
export class InjectorService implements HttpInterceptor{

  constructor(public user_service:UserService) { }

  request:HttpRequest<any>; 
  authtoken = this.user_service.GetLoggedInUser();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authtoken = this.user_service.GetLoggedInUser();
    this.request = req.clone({
      setHeaders:
      {
        // sets the Authorization header = to the Bearer token IF the token exists, otherwise its set as "no token"
        Authorization: `Bearer ${(this.authtoken == null) ? "no token" : this.authtoken.token}`
      }
    });
    return next.handle(this.request);
  }
}
