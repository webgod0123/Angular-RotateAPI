import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFollowers } from 'src/app/models/DTOs/Requests/userfollower.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { SurveyResponse } from 'src/app/models/DTOs/Responses/survey-response.model';
import { UserFollowerResponse } from 'src/app/models/DTOs/Responses/userfollowerresponse.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Post_Node } from 'src/app/models/Lists/post_node.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { Profile } from 'src/app/models/profile.model';
import { Survey } from 'src/app/models/survey.model';
import { User } from 'src/app/models/user.model';
import { CheckSideService } from 'src/app/services/check-side.service';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SurveyService } from 'src/app/services/survey.service';
import { UserFollowerServiceService } from 'src/app/services/user-follower-service.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private user_svc:UserService,
              private post_svc:PostService,
              private profile_svc:ProfileService,
              private route:ActivatedRoute,
              private router:Router,
              public spinner:NgxSpinnerService,
              private follow_svc:UserFollowerServiceService,
              private survey_svc : SurveyService,
              private side_svc : CheckSideService) { }
  
  userID : number = this.user_svc.GetCurrentUserID()!;
  user : User;
  profileUserID : string;
  followed:Boolean;
  follow_but_txt : string = ''
  show_rebuttals  :boolean = false;

  pictureLoaded : boolean = false;
  profile : Profile;
  relationship_id : string = '';
  survey : Survey;
  sideText : string;

  rebut_node_list : Timestamp_List = new Timestamp_List();
  rebuttals : Post[] = [];
  
  count : number;

  current_type = 0;

  bipart_val : number = 0;
  opp_val : number = 0;
  
  side : number;

  menu_to_show : number = 0;
  show_bipart_menu : boolean = false;
  user_list : number[] = [];

  ngOnInit(): void 
  {
    this.route.params.subscribe(
      async params =>
      {
        this.profileUserID = params.id;
        await this.ContInit();
      }
    )
  } // end init

  async ContInit()
  {
    await this.GetUser();
    if(this.user.userID == this.userID)
    {
         this.router.navigate(['/u/o']);
    }
    await this.GetProfile();
    await this.GetCount();
    await this.GetRelationship();
    await this.GetSurvey();

    var total = this.user.total;
    this.side = this.side_svc.GetTotalSide(total);
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
  } // end function
  async GetProfile()
  {
    await this.profile_svc.GetProfile(this.user.userID).then(
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
  
  async GetUser()
  {
    await this.user_svc.GetUserName(this.profileUserID).then(
      (data:User_Response) =>
      {
        this.user = data.user;
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    );
  } // end function

  async GetRelationship()
  {
    await this.follow_svc.GetRelationship(this.userID, this.user.userID).then(
      (data:UserFollowerResponse) =>
      {
        this.ToggleFollow(data.followed);
        this.relationship_id = this.followed ? data.userFollower.relationshipID : '';
      },
      (error:UserFollowerResponse) =>
      {
        console.error(error);
      }
    )
  } // end function

  async GetCount()
  {
    await this.follow_svc.GetFollowerCount(this.user.userID).then(
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
    await this.survey_svc.GetSurvey(this.user.userID).then(
      (data:SurveyResponse) =>
      {
        this.survey = data.survey;
      },
      (error:SurveyResponse) =>
      {
        console.error(error);
      }
    )
  } // end function

  FollowUnfollow()
  {
    if(!this.followed)
    {
      var follow_obj = new UserFollowers();
      follow_obj.userID = this.user.userID;
      follow_obj.followerID = this.userID;

      this.follow_svc.FollowUser(follow_obj).then(
        (data:UserFollowerResponse) =>
        {
          this.ToggleFollow(data.followed);
          this.relationship_id = data.userFollower.relationshipID;
        },
        (error:UserFollowerResponse) =>
        {
          console.error(error);
        }
      );
      return;
    }
    else
    {
      this.follow_svc.UnfollowUser(this.relationship_id).then(
        (data:UserFollowerResponse) =>
        {
          this.ToggleFollow(data.followed);
        },
        (error:UserFollowerResponse) =>
        {
          console.log(error);
        }
      )
      return;
    }
  } // end function

  ToggleFollow(state : boolean)
  {
    this.followed = state;
    this.follow_but_txt = (this.followed) ? 'Followed' : 'Follow';
    this.GetCount();
  } // end function

  ChangeType(i : number)
  {
    this.current_type = i;
  }

  CalcBipartMetric()
  {
    if(this.count)
    {
      console.log("hello", this.count, this.opp_val);
      this.bipart_val = 100 * (this.opp_val / this.count);
    }
    else
    {
      this.bipart_val = 0;
    }
  }
  async GetSides()
  {
    await this.follow_svc.GetFollowers(this.user.userID).then(
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
  ToggleBipartMenu(i : number)
  {
    this.menu_to_show = i;
    this.show_bipart_menu = ! this.show_bipart_menu;
  }
} // end class
