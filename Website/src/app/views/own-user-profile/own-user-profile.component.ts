import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { Post_Node } from 'src/app/models/Lists/post_node.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { FileValidationService } from 'src/app/services/file-validation.service';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling'; 
import { Profile } from 'src/app/models/profile.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { UserFollowerServiceService } from 'src/app/services/user-follower-service.service';
import { UserFollowerResponse } from 'src/app/models/DTOs/Responses/userfollowerresponse.model';
import { AreYouSureComponent } from 'src/app/common/are-you-sure/are-you-sure.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { SurveyService } from 'src/app/services/survey.service';
import { Survey } from 'src/app/models/survey.model';
import { SurveyResponse } from 'src/app/models/DTOs/Responses/survey-response.model';
import { CheckSideService } from 'src/app/services/check-side.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-own-user-profile',
  templateUrl: './own-user-profile.component.html',
  styleUrls: ['./own-user-profile.component.css']
})
export class OwnUserProfileComponent implements OnInit {

  
  constructor(private router : Router, 
              private pro_svc : ProfileService,
              private user_svc : UserService,
              private validate: FileValidationService,
              public spinner : NgxSpinnerService,
              public follow_svc : UserFollowerServiceService,
              private dialog:MatDialog,
              private svc : AuthService,
              private survey_svc : SurveyService,
              private side_svc : CheckSideService) { }

  userID : number = this.user_svc.GetCurrentUserID()!;
  user : User = new User();
  show_rebuttals  :boolean = false;
  user_list : number[] = [];
  pictureLoaded : boolean = false;
  profile : Profile;
  profileForm: FormGroup;
  survey : Survey;
  sideText : string = "";
  
  imageChangedEvent:any = '';
  bannerChangedEvent:any = '';
  
  imageName:string = '';

  bipart_val : number = 0;
  opp_val : number = 0;
  count:number = 0;
  
  side : number;
  
  show_bipart_menu : boolean = false;
  menu_to_show : number = 0;

  current_type : number = 0;
  async ngOnInit()
  {

    if(this.userID == null)
    {
      this.router.navigate(['/landing']);
    }
    this.spinner.show();

    await this.GetUser();
    await this.GetProfile();
    await this.GetFollowerCount();
    await this.GetSurvey();

    this.profileForm = new FormGroup(
    {
      picture: new FormControl('', [Validators.required])
    });

    this.side = this.side_svc.GetTotalSide(this.survey.total);
    switch(this.side)
    {
      case -2:
        this.sideText = "Left"
      break;
      case -1:
        this.sideText = "Slightly Left"
      break;
      case -0:
        this.sideText = "Centre"
      break;
      case 1:
        this.sideText = "Slightly Right"
      break;
      case 2:
        this.sideText = "Right"
      break;
    }
    await this.GetSides();
    this.CalcBipartMetric();
    this.spinner.hide();
  }

  CalcBipartMetric()
  {
    if(this.count)
    {
      this.bipart_val = 100 * (this.opp_val / this.count);
    }
    else
    {
      this.bipart_val = 0;
    }
  }
  async GetUser()
  {
    await this.user_svc.GetUser(this.userID).then(
      (data:User_Response) =>
      {
        this.user = data.user;
      }
    );
  }
  async GetProfile()
  {
    await this.pro_svc.GetProfile(this.userID).then(
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
  } // end function
  async GetFollowerCount()
  {
    await this.follow_svc.GetFollowerCount(this.userID).then(
      (data:UserFollowerResponse) =>
      {
        this.count = data.count;
      },
      (error:UserFollowerResponse) =>
      {
        console.error(error);
      }
    )
  } // end function

  async GetSurvey()
  {
    await this.survey_svc.GetSurvey(this.userID).then(
      (data:SurveyResponse) =>
      {
        this.survey = data.survey;
      },
      (error:SurveyResponse) =>
      {
        console.error(error);
      }
    )
  }
  async GetSides()
  {
    await this.follow_svc.GetFollowers(this.userID).then(
      async (data:UserFollowerResponse) =>
      {
        for(let user of data.userList)
        {
          this.user_list.push(user);
          await this.user_svc.GetUser(user).then(
            (res:User_Response) =>
            {
              if(this.side >= 0 && this.side_svc.GetTotalSide(res.user.total) <= 0)
              {
                this.opp_val += 1;
              }
              else if(this.side <= 0 && this.side_svc.GetTotalSide(res.user.total) >= 0)
              {
                this.opp_val += 1;
              }
            }
          );
        }
      }
    )
  }
  //Picture Functions
  ExitCropping()
  {
    this.imageChangedEvent = '';
    this.bannerChangedEvent = '';
  }
  onFileChanged(event:any)
  {
    if(event.target.files.length > 0)
    {
      const file = event.target.files[0];
      if(!this.validate.validateFile(file.name))
      {
        console.error("This is not a valid file type");
        return;
      }
      this.profileForm.patchValue ({
        picture: file
      });
      this.imageName = file.name;
    }
    this.imageChangedEvent = event;
  }
  onBannerChanged(event:any)
  {
    if(event.target.files.length > 0)
    {
      const file = event.target.files[0];
      if(!this.validate.validateFile(file.name))
      {
        console.error("This is not a valid file type");
        return;
      }
      this.profileForm.patchValue ({
        picture: file
      });
      this.imageName = file.name;
    }
    this.bannerChangedEvent = event;
  }
  imageCropped(event : ImageCroppedEvent)
  {
    var blob : BlobPart[] = [];
    console.log(base64ToFile(event.base64!));
    blob.push(base64ToFile(event.base64!));
    var file : File = new File(blob, this.imageName);
    this.profileForm.patchValue({
      picture: file
    });
  }
  bannerImageCropped(event : ImageCroppedEvent)
  {
    var blob : BlobPart[] = [];
    console.log(base64ToFile(event.base64!));
    blob.push(base64ToFile(event.base64!));
    var file : File = new File(blob, this.imageName);
    this.profileForm.patchValue({
      picture: file
    });
  }
  cropperReady()
  {

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
    
    this.pro_svc.AddPfp(this.userID, formData).then(
      (data:ProfileResponse) =>
      {
        this.GetProfile();
        location.reload();
        this.imageChangedEvent='';
      },
      error =>
      {
        console.log(error);
      }
    )
  }
  
  onSubmitBanner()
  {
    const formData = new FormData();
    
    for(const key of Object.keys(this.profileForm.value))
    {
      console.log("hello");
      const value = this.profileForm.value[key];
      if(!this.validate.validateFile(value.name))
      {
        console.error("This is not a valid file type");
        return;
      }
      formData.append(key, value);
    }
    
    this.pro_svc.AddBanner(this.userID, formData).then(
      (data:ProfileResponse) =>
      {
        this.GetProfile();
        location.reload();
        this.imageChangedEvent='';
      },
      error =>
      {
        console.log(error);
      }
    )
  }
  LogOutUser()
  {
    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '250px',
      data: "log out?"
    });

    dialogRef.afterClosed().subscribe(
      result => {
      console.log('The dialog was closed');
      if(result)
      {
        this.svc.LogOutUser();
        this.router.navigate(['/landing']);
      }
    });
  }
  ToggleRebuttals()
  {
    this.show_rebuttals = !this.show_rebuttals;
  }
  ToggleBipartMenu(i : number)
  {
    this.menu_to_show = i;
    this.show_bipart_menu = ! this.show_bipart_menu;
  }
  ChangeType(i : number)
  {
    this.current_type = i;
  }
}
