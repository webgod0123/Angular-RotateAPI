import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { EmailRequest } from 'src/app/models/DTOs/Requests/email-request.model';
import { UserLogin } from 'src/app/models/DTOs/Requests/user-login.model';
import { RegistrationResponse } from 'src/app/models/DTOs/Responses/registrationresponse.model';
import { Token } from 'src/app/models/token.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  error : any;
  show : boolean = false;
  constructor(public service:AuthService,
              public router:Router,
              public spinner : NgxSpinnerService) { }

  ngOnInit(): void {
    
  }
  onSubmit(form:NgForm)
  {
    this.spinner.show()
    this.service.checkUser().then(
      (data:RegistrationResponse)=> 
      {
        if(data.token)
        {
          this.service.SetLoggedInUser(data.token);
          this.resetForm(form);
          this.spinner.hide();
          this.router.navigate(['/home']);
        }
        else
        {
          var email = new EmailRequest();
          email.email = this.service.formData.email;
          
          email.uRL = environment.BASE_URL + '/api/v1/verify-email';
          this.service.SendEmail(email);
          this.resetForm(form);
          this.spinner.hide();
          this.router.navigate(['/verify-email']);
        }
        

      },
      err =>
      {
        console.error(err);
        this.error = err;
        this.spinner.hide();
      }
    );
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
