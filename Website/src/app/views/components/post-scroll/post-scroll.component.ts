import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/models/topic.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';

@Component({
  selector: 'app-post-scroll',
  templateUrl: './post-scroll.component.html',
  styleUrls: ['./post-scroll.component.css']
})
export class PostScrollComponent implements OnInit {

  user : User = {} as User;
  loading : boolean = true;

  constructor(private userSvc: UserService, 
              private topic_svc : TopicService) { }

  
  @Input() item: Post;
  topic : Topic;

  async ngOnInit()
  {
    this.loading = true;

    await this.GetUserHTTP(this.item.userID);

    if(this.item.topicID != null)
    {
      await this.GetTopic();
    }
    this.loading = false;

  } // end init

  async GetUserHTTP(id:number)
  {
    return await this.userSvc.GetUser(id).then(
      (data:User_Response) =>
      {
        this.user = data.user;
      },
      err =>
      {
        console.error(err);
      });
  } // end function

  async GetTopic()
  {
    await this.topic_svc.GetTopic(this.item.topicID!).then(
      (data:TopicResponse) =>
      {
        this.topic = data.topic;
      },
      (error:TopicResponse) =>
      {
        console.error(error);
      }
    )
  } // end function

  formatDate(date:Date){
    // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString("en-US"); 
  }
}
