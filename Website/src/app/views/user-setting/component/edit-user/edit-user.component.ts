import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Profile } from 'src/app/models/profile.model';
import { User } from 'src/app/models/user.model';
import { FileValidationService } from 'src/app/services/file-validation.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  profileForm: FormGroup;
  userID : number = this.user_svc.GetCurrentUserID()!;

  change_pic: boolean;
  profile: Profile;
  pictureLoaded: boolean;
  user : User;

  changeUser : User = new User();
  changeProfile : Profile = new Profile();

  constructor(private user_svc : UserService,
              private profile_svc : ProfileService,
              private validate : FileValidationService) { }


  
  async ngOnInit()
  {
    await this.GetProfile();
    await this.GetUser();
  }

  async GetUser()
  {
    await this.user_svc.GetUser(this.userID).then(
      (data:User_Response) =>
      {
        this.user = data.user;
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    )
  }
  async SubmitUser(form:NgForm)
  {
    
    var patch_user = [
      { op: "test", path: "/userID", value : this.userID.toString() },
      { op: "replace", path: '/username', value : (this.changeUser.username != null) ? this.changeUser.username : this.user.username },
      { op: "replace", path: '/displayName', value : (this.changeUser.displayName != null) ? this.changeUser.displayName : this.user.displayName },
      { op: "replace", path: '/email', value : (this.changeUser.email != null) ? this.changeUser.email : this.user.email },
      { op: "replace", path: '/phoneNumber', value : (this.changeUser.phoneNumber != null) ? this.changeUser.phoneNumber : this.user.phoneNumber },
    ];

    var patch_profile = [
      { op:"test", path: "/userID", value: this.userID.toString() },
      { op:"replace", path:"/pronouns", value: (this.changeProfile.pronouns != null) ? this.changeProfile.pronouns : this.profile.pronouns },
      { op:"replace", path:"/bio", value: (this.changeProfile.bio != null) ? this.changeProfile.bio : this.profile.bio },
      { op:"replace", path:"/country", value: (this.changeProfile.country != null) ? this.changeProfile.country : this.profile.country },
      { op:"replace", path:"/website", value: (this.changeProfile.website != null) ? this.changeProfile.website : this.profile.website },
    ]

    await this.user_svc.UpdateUser(this.userID, patch_user).then(
      (data:User_Response) =>
      {
        console.log(data);
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    );
    await this.profile_svc.UpdateProfile(this.userID, patch_profile).then(
      (data:ProfileResponse) =>
      {
        console.log(data);
      },
      (error:ProfileResponse) =>
      {
        console.error(error);
      }
    );
    form.form.reset();
    await this.ngOnInit();
  }
  Cancel(form:NgForm)
  {
    form.reset();
  }
  //Picture Functions
  ToggleChangePic()
  {
    this.change_pic = !this.change_pic;
    this.profileForm = new FormGroup(
      {
        picture: new FormControl('', [Validators.required])
      });
  
  }
  onSubmit()
  {
    const formData = new FormData();
    
    for(const key of Object.keys(this.profileForm.value))
    {
      const value = this.profileForm.value[key];
      if(!this.validate.validateFile(value.name))
      {
        console.error("This is not a valid file type");
        return;
      }
      formData.append(key, value);
    }
    
    this.profile_svc.AddPfp(this.userID, formData).then(
      (data:ProfileResponse) =>
      {
        this.GetProfile();
        this.ToggleChangePic();
      },
      error =>
      {
        console.log(error);
      }
    )
  }
  async GetProfile()
  {
    await this.profile_svc.GetProfile(this.userID).then(
      (data:ProfileResponse) =>
      {
        this.profile = data.profile;
        
        this.pictureLoaded = true;
      },
      (error) =>
      {
        console.error(error);
      }
    )
  }
  onFileChanged(event:any)
  {
    if(event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.profileForm.patchValue ({
        picture: file
      });
    }
  }
}
