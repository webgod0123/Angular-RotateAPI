import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { RegistrationResponse } from 'src/app/models/DTOs/Responses/registrationresponse.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(private service : AuthService,
              private route : ActivatedRoute,
              private profile_svc : ProfileService,
              private user_svc : UserService,
              private router:Router,
              private spinner : NgxSpinnerService) { }

  ngOnInit(): void 
  {
    var profile = new Profile();
    profile.profilePic = environment.BASE_URL_BLOB + environment.default_pic;
    this.spinner.show();
    this.route.params.subscribe(
      (params) =>
      {
        this.service.VerifyEmail(params.id).then(
          (data:RegistrationResponse) =>
          {
            if(data.token)
            {
              this.service.SetLoggedInUser(data.token);
              profile.userID = this.user_svc.GetCurrentUserID()!;
              this.profile_svc.NewProfile(profile);
              this.router.navigate(['/survey']);
              this.spinner.hide();
            }
          },
          (error:RegistrationResponse) =>
          {
            console.error(error);
            this.router.navigate(['/landing']);
            this.spinner.hide();
          }
        )
      }
    )
  }

}
