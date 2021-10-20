import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailRequest } from 'src/app/models/DTOs/Requests/email-request.model';
import { UserLogin } from 'src/app/models/DTOs/Requests/user-login.model';
import { RegistrationResponse } from 'src/app/models/DTOs/Responses/registrationresponse.model';
import { Profile } from 'src/app/models/profile.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ["./sign-up-form.component.css"]
})
export class SignUpFormComponent implements OnInit {

  constructor(public service:AuthService,
              public profile_svc:ProfileService,
              public spinner : NgxSpinnerService,
              public router : Router,
              public user_svc : UserService) { }

  confirm : string = "";
  show = false;
  error : any;
  ngOnInit(): void {
  }
  onSubmit(form:NgForm)
  {
    this.spinner.show();

    this.service.postUser().then(
      async res => {
        var email = new EmailRequest();
        email.email = this.service.formData.email;
        
        email.uRL = location.origin + '/new-user/';
        await this.service.SendEmail(email).then(
          (data:RegistrationResponse) =>
          {
            console.log(data);
          },
          (error:RegistrationResponse) =>
          {
            console.error(error);
          }
        );
        this.resetForm(form);
        this.spinner.hide();
        this.router.navigate(['/verify-email']);
      },
      err => {
        console.log(err),
        console.log(form)
        this.error = err;
        this.spinner.hide();
      }
    );
  }

  redirect(){
    this.router.navigate(['/survey']);
    // window.location.href="perspective.social/survey"
  }
  resetForm(form:NgForm)
  {
    form.form.reset();
    this.service.formData = new UserLogin();
  }
  password()
  {
    this.show = !this.show;
  }
}
