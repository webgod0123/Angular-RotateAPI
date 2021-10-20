import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { Profile } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
/**
 * This is the basic Post Page that redirects to each
 * other post page based on their type.
 */
export class PostComponent implements OnInit {

  // User Vars
  user_id : number = this.user_svc.GetCurrentUserID()!;
  user: User;
  profile: Profile;

  constructor(private post_svc:PostService, 
              private route:ActivatedRoute,
              private user_svc:UserService,
              private profile_svc: ProfileService,
              private router:Router) { }

  // Post Vars
  post_id : string;
  item : Post;
  loading : boolean = true;
  blocked_id_list : number[] = []

  ngOnInit()
  { 
    this.route.params.subscribe(
      async params =>
      {
        this.post_id = params.id;
        await this.InitCont();
      }
    )
  }
  // Initialization to change
  async InitCont()
  {
    if(this.user_id != null)
    {
      await this.GetBlockedUsers();
    }
    await this.GetPost(this.post_id)
    if(this.item.delete || this.blocked_id_list.indexOf(this.item.userID) != -1)
    {
      if(this.item.type == "Comment")
      {
        this.item.userID = -1;
        this.item.body = "You cannot view this post for various reasons"
      }
      else
      {
        this.router.navigate(['/home']);
      }
    }
    if(this.item.userID != -1)
    {
      await this.GetUsername();
    }
    else
    {
      this.user = new User();
    }
    await this.GetBanner();
    this.loading = false;

  }
  async GetBlockedUsers()
  {
    await this.user_svc.GetAllBlockedUsers(this.user_id!).then(
      (data:BlockedResponse) =>
      {
        for(let user of data.blockedUsers)
        {
          this.blocked_id_list.push(user.userID);
        }
      },
      (error:BlockedResponse) =>
      {
        console.error(error);
      }
    )
  }
  async GetUsername(){
    
    this.user_svc.GetUser(this.item.userID).then(
      (data: User_Response) => 
      {
        this.user = data.user;
      },
      err =>
      {
        console.error(err);
      }
    )
  }
  
  async GetPost(id : string)
  {
    return this.post_svc.GetPost(id).then(
      (data:Post_Response) =>
      {
        this.item = data.post;
      },
      err =>
      {
        console.error(err);
      }
    );
   
  }

  async GetBanner(){
    this.profile_svc.GetProfile(this.user_id).then(
      (data:ProfileResponse) => {
          this.profile = data.profile
        });
  }

}
