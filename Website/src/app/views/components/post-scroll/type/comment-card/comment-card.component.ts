import { Component, Input, OnInit } from '@angular/core';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Post } from 'src/app/models/post.model';
import { Profile } from 'src/app/models/profile.model';
import { Topic } from 'src/app/models/topic.model';
import { User } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {

  constructor(private post_svc : PostService,
              private user_svc : UserService,
              private topic_svc : TopicService,
              private pro_svc : ProfileService) { }

  @Input() item : Post;
  @Input() user : User;
  profile : Profile;

  parent_post : Post
  parent_user :  User
  parent_prof : Profile;

  alpha_post: Post
  alpha_user : User
  alpha_topic : Topic;
  alpha_prof : Profile;

  async ngOnInit() 
  {
    this.profile = await this.GetProfile(this.user.userID);
    if(this.item.alphaPostID)
    {
      await this.GetAlpha();
      this.alpha_user = await this.GetUser(this.alpha_post.userID);
      this.alpha_prof = await this.GetProfile(this.alpha_post.userID);
      await this.GetTopic();
    }
    if(this.item.parentPostID != this.item.alphaPostID)
    {
      await this.GetParent();
      this.parent_user = await this.GetUser(this.parent_post.userID);
      this.parent_prof = await this.GetProfile(this.parent_post.userID);
    }
  }
  async GetParent()
  {
    await this.post_svc.GetPost(this.item.parentPostID!).then(
      (data:Post_Response) =>
      {
        this.parent_post = data.post;
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
  }
  async GetAlpha()
  {
    await this.post_svc.GetPost(this.item.alphaPostID!).then(
      (data:Post_Response) =>
      {
        this.alpha_post = data.post;
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
  }
  async GetUser(id : number) : Promise<User>
  {
    return await this.user_svc.GetUser(id).then(
      (data:User_Response) =>
      {
        return data.user
      },
      (error:User_Response) =>
      {
        console.error(error);
        return new User();
      }
    )
  }
  async GetTopic()
  {
    await this.topic_svc.GetTopic(this.alpha_post.topicID!).then(
      (data:TopicResponse) =>
      {
        this.alpha_topic = data.topic;
      }
    )
  }
  async GetProfile(id : number) : Promise<Profile>
  {
    return await this.pro_svc.GetProfile(id).then(
      (data:ProfileResponse) =>
      {
        return data.profile;
      },
      (error:ProfileResponse) =>
      {
        console.error(error);
        return new Profile();
      }
    )
  }
}
