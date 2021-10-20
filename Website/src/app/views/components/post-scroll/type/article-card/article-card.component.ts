import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureComponent } from 'src/app/common/are-you-sure/are-you-sure.component';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Post } from 'src/app/models/post.model';
import { Topic } from 'src/app/models/topic.model';
import { User } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {

  @Input() user : User = {} as User;

  own_post : boolean = false;
  router_url : string = '';
  loading : boolean = true;
  newDate: string;
  image_url : string = '';
  delete : boolean;

  constructor(private userSvc: UserService, 
              private post_svc : PostService,
              private profile_svc : ProfileService,
              private dialog : MatDialog) { }

  
  @Input() item: Post;
  @Input() topic : Topic;

  async ngOnInit()
  {
    this.loading = true;
    if(this.item.bannerImage != "" && this.item.bannerImage != null && this.item.bannerImage != environment.def_createbannerpic)
    {
      this.image_url = this.item.bannerImage!;
    }
    else
    {
      this.GetProfilePic();
    }
    if(this.user.userID == this.userSvc.GetCurrentUserID()!)
    {
      this.own_post = true;
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
        this.image_url = encodeURI(data.profile.profilePic);
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
  DeletePost()
  {
      const dialogRef = this.dialog.open(AreYouSureComponent, {
        width: '250px',
        data: "delete this post?"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.delete = result;
        this.ContDeletePost();
      });
  }
  ContDeletePost()
  {
    if(this.delete)
    {
      this.post_svc.DeletePost(this.item.postID);  
      location.reload(); 
    }
  }
}
