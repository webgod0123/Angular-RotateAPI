import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Security } from 'src/app/models/DTOs/Requests/security.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  constructor(private user_svc : UserService) { }

  userID : number  = this.user_svc.GetCurrentUserID()!;
  security : Security = new Security();
  confirm : string = "";
  user : User;

  async ngOnInit() 
  {
    
  }
  async SubmitSecure(form:NgForm)
  {
    
    this.security.private = (this.security.private == null) ? false : this.security.private;
    await this.user_svc.UpdateUserPassword(this.userID, this.security).then(
      (data:User_Response) =>
      {
        console.log(data)
      },
      (error:User_Response) =>
      {
        console.error(error)
      }
    )
    form.form.reset();
  }
}
