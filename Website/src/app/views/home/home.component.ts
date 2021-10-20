import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post_Node } from 'src/app/models/Lists/post_node.model';
import { UserTopicsService } from 'src/app/services/user-topics.service';
import { UserTopicResponse } from 'src/app/models/DTOs/Responses/usertopicresponse.model';
import { Router } from '@angular/router';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { UserFollowerServiceService } from 'src/app/services/user-follower-service.service';
import { UserFollowerResponse } from 'src/app/models/DTOs/Responses/userfollowerresponse.model';
import { TopicService } from 'src/app/services/topic.service';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { Topic } from 'src/app/models/topic.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  user_id : number | null = this.user_svc.GetCurrentUserID();
  current_type : number = -1; // 0 = home, 1 = article, 2 = discussion, 3 = rebuttal
  previous_type : number  = -1;
  post_node_list : Timestamp_List = new Timestamp_List();
  posts : Post[] = [];

  topics_list : number[] = [];
  followed_list : number[] = [];
  display_topics_list : Topic[] = [];
  notScrollingY = true;
  notEmptyPost = true;

  accordion:boolean = false;
  home_toggle : boolean = false;

  blocked_id_list : number[] = [];

  constructor(private spinner: NgxSpinnerService, 
              public post_service: PostService, 
              public user_svc:UserService,
              public topics_user_svc:UserTopicsService,
              public followed_usr_svc:UserFollowerServiceService,
              public router : Router,
              public topic_svc : TopicService) { }

  async ngOnInit() 
  {
    if(this.user_id == null)
    {
      this.router.navigate(['/landing']);
      return;
    }
    this.spinner.show();
    await this.CreateBlockedList();
    await this.GetLists();
    for(var i = 0; i <= 2; i++)
    {
      if(this.topics_list[i] == null)
      {
        break;
      }
      this.GetTopic(this.topics_list[i]);
    }
    await this.HomePostList();
  }
  async CreateBlockedList()
  {
    await this.user_svc.GetAllBlockedUsers(this.user_id!).then(
      (data:BlockedResponse) =>
      {
        for(let u of data.blockedUsers)
        {
          this.blocked_id_list.push(u.userID);
        }
      }
    )
  }
  async GetLists()
  {
    await this.GetUserFollowedTopics();
    await this.GetUserFollowedUsers();
  }
  async HomePostList() 
  {
    if(this.ChangeCurrentType(0))
    {
      return;
    }
    await this.GetLists();
    if(this.topics_list.length == 0 && this.followed_list.length == 0)
    {
      this.post_service.GetPostIds().subscribe(
        (data:Post_Response) => 
        {
          if(data.success == false)
          {
            console.error(data);
          }
          else
          {
            this.AddToLinkedList(data.postList);
          }
        },
        (error:Post_Response) =>
        {
          console.error(error);
        }
      )
    }
    else
    {
      for (let topic of this.topics_list)
      {
        await this.post_service.GetPostsTopicID(topic).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
      for (let user of this.followed_list)
      {
        await this.post_service.GetPostsUserID(user).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
      
    }
    this.spinner.hide();
    this.PostListInit();
  } // end function
  async ArticlePostList()
  {
    if(this.ChangeCurrentType(1))
    {
      return;
    }
    this.spinner.show();
    await this.GetLists()
    if(this.topics_list.length == 0 && this.followed_list.length == 0)
    {
      await this.post_service.GetPostsType("Article").then(
        (data:Post_Response) => 
        {
          this.AddToLinkedList(data.postList);
        },
        (error:Post_Response) =>
        {
          console.error(error.errors);
        }
      );
    }
    else
    {
      for (let topic of this.topics_list)
      {
        await this.post_service.GetPostsTopicAndType("Article:" + topic).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
      for (let user of this.followed_list)
      {
        await this.post_service.GetPostsUserAndType("Article:" + user).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
    }
    
  } // end function

  async DiscussionPostList()
  {
    if(this.ChangeCurrentType(2))
    {
      return;
    }
    this.spinner.show();
    await this.GetLists();
    if(this.topics_list.length == 0 && this.followed_list.length == 0)
    {
      await this.post_service.GetPostsType("Discussion").then(
        (data:Post_Response) => 
        {
          this.AddToLinkedList(data.postList);
        },
        (error:Post_Response) =>
        {
          console.error(error.errors);
        }
      );
    }
    else
    {
      for (let topic of this.topics_list)
      {
        await this.post_service.GetPostsTopicAndType("Discussion:" + topic).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
      for (let user of this.followed_list)
      {
        await this.post_service.GetPostsUserAndType("Discussion:" + user).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
    }
    this.spinner.hide();
    this.PostListInit();
  } // end function
  async RebuttalsPostList()
  {
    if(this.ChangeCurrentType(3))
    {
      return;
    }
    this.spinner.show();
    await this.GetLists()
    if(this.topics_list.length == 0 && this.followed_list.length == 0)
    {
      await this.post_service.GetPostsType("Rebuttal").then(
        (data:Post_Response) => 
        {
          this.AddToLinkedList(data.postList);
        },
        (error:Post_Response) =>
        {
          console.error(error.errors);
        }
      );
    }
    else
    {
      for (let topic of this.topics_list)
      {
        await this.post_service.GetPostsTopicAndType("Rebuttal:" + topic).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
      for (let user of this.followed_list)
      {
        await this.post_service.GetPostsUserAndType("Rebuttal:" + user).then(
          (data:Post_Response) =>
          {
            this.AddToLinkedList(data.postList);
          },
          (error:Post_Response) =>
          {
            console.error(error);
          }
        );
      }
    }
    this.spinner.hide();
    this.PostListInit();
  } // end function
  AddToLinkedList(post : Post[])
  {
    for(let p of post)
    {
      var blocked : boolean = false;
      for(let u of this.blocked_id_list)
      {
        if(p.userID == u)
        {
          blocked = true;
          break;
        }
      }
      if(!blocked && !p.delete)
      {
        this.post_node_list.Insert(p);
      }
    }
    this.spinner.hide();
    this.PostListInit();
  }
  OnScroll()
  {
    if(this.post_node_list.first != null)
    {
      this.notEmptyPost = true;
    }
    if(this.notScrollingY && this.notEmptyPost)
    {
      this.spinner.show();
      this.notScrollingY = false;
      this.LoadNextPost();
    }
  } // end function

  LoadNextPost()
  {
    if(this.post_node_list.first == null)
    {
      this.notEmptyPost = false;
      this.spinner.hide();
      return;
    }
    this.AddPostToArray(this.post_node_list.Pop()!);
  } // end function

  PostListInit()
  {
    for (var i = 0; i < 10; i++)
    {
      this.LoadNextPost();
    }
  } // end function
  ChangeCurrentType(type : number) : boolean
  {
    if(this.current_type == type)
    {
      return true;
    }    
    this.previous_type = this.current_type;
    this.current_type = type;
    if(this.post_node_list != null)
    {
      this.post_node_list = new Timestamp_List();
    }
    this.posts = [];
    return false;
  } // end function

  AddPostToArray(post : Post)
  {
      this.spinner.hide();
      this.notScrollingY = true;
      this.posts.push(post);
  } // end function
  async GetTopic(id:number)
  {
    await this.topic_svc.GetTopic(id).then(
      (data:TopicResponse) =>
      {
        this.display_topics_list.push(data.topic);
      }
    )
  }
  async GetUserFollowedTopics()
  {
    await this.topics_user_svc.GetFollowedTopicsUser(this.user_id!).then
    (
      (data:UserTopicResponse) =>
      {
        this.topics_list = data.topicList;
      },
      (error:UserTopicResponse) =>
      {
        console.error(error);
      }
    );
  } // end function
  async GetUserFollowedUsers()
  {
    await this.followed_usr_svc.GetFollowedUsers(this.user_id!).then(
      (data:UserFollowerResponse) =>
      {
       this.followed_list = data.userList;
      },
      (error:UserFollowerResponse) =>
      {
        console.error(error);
      }
    )
  }
  ToggleAccordion()
  {
    this.accordion = !this.accordion;
  }
  ToggleHome()
  {
    this.home_toggle = !this.home_toggle;
  }
  
}
