import { Component, Input, OnInit } from '@angular/core';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { Post } from 'src/app/models/post.model';
import { Topic } from 'src/app/models/topic.model';
import { User } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-discussion-card',
  templateUrl: './discussion-card.component.html',
  styleUrls: ['./discussion-card.component.css']
})
export class DiscussionCardComponent implements OnInit {

  @Input() user : User = {} as User;

  own_post : boolean = false;
  router_url : string = '';
  loading : boolean = true;
  newDate: string;
  image_url : string = '';

  constructor(private userSvc: UserService, 
              private topic_svc : TopicService,
              private profile_svc : ProfileService) { }

  
  @Input() item: Post;
  @Input() topic : Topic;

  async ngOnInit()
  {
    this.loading = true;
    if(this.item.bannerImage != null)
    {
      this.image_url = this.item.bannerImage;
    }
    else
    {
      this.GetProfilePic();
    }
    if(this.user.userID == this.userSvc.GetCurrentUserID()!)
    {
      this.own_post = false;
      this.router_url = '/profile';
    }
    else
    {
      this.router_url = '/u/' + this.user.username;
    }

    this.loading = false;

    this.newDate = this.formatDate(this.item.timestamp);
  } // end init

  async GetProfilePic()
  {
    await this.profile_svc.GetProfile(this.user.userID).then(
      (data:ProfileResponse) =>
      {
        this.image_url = data.profile.profilePic;
      },
      (error:ProfileResponse) =>
      {
        console.error(error);
      }
    )
  }
  formatDate(date:Date){
    // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString("en-US"); 
  }

}
