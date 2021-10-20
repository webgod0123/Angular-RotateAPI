import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserTopics } from 'src/app/models/DTOs/Requests/usertopic.model';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { UserTopicResponse } from 'src/app/models/DTOs/Responses/usertopicresponse.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { Topic } from 'src/app/models/topic.model';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserTopicsService } from 'src/app/services/user-topics.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-discussionhub',
  templateUrl: './discussionhub.component.html',
  styleUrls: ['./discussionhub.component.css']
})
export class DiscussionhubComponent implements OnInit {

  constructor(private route : ActivatedRoute,
              private top_svc : TopicService,
              private post_svc : PostService,
              private spinner : NgxSpinnerService,
              private user_svc : UserService,
              private top_fol_svc : UserTopicsService) { }

  user_id : number = this.user_svc.GetCurrentUserID()!;

  topic : Topic;
  followed : boolean = false;
  follow_but_txt : string = "";
  relationship_id : number;

  posts : Timestamp_List = new Timestamp_List();
  display_posts : Post[] = [];
  loading : boolean = true;
  notScrollingY : boolean = true;
  notEmptyPost : boolean = true;

  blocked_id_list : number[] = [];
  ngOnInit(): void 
  {
    this.route.params.subscribe(
      async params =>
      {
        this.TopicInit(params.id);
        await this.GetBlocked();
        await this.GetPosts();
        this.PostListInit();
      }
    )
  }
  async TopicInit(id:number)
  {
    await this.top_svc.GetTopic(id).then(
      (data:TopicResponse) =>
      {
        this.topic = data.topic;
      },
      (error:TopicResponse) =>
      {
        console.error(error);
        return;
      }
    );

    await this.top_fol_svc.GetRelationship(this.user_id, id).then(
      (data:UserTopicResponse) =>
      {
        this.ToggleFollow(data.followed);
        if(data.relationship)
        {
          this.relationship_id = data.relationship.userTopicID;
        }
      },
      (error:UserTopicResponse) =>
      {
        console.error(error);
      }
    )
  }
  async GetBlocked()
  {
    await this.user_svc.GetAllBlockedUsers(this.user_id).then(
      (data:BlockedResponse) =>
      {
        for(let b of data.blockedUsers)
        {
          this.blocked_id_list.push(b.userID);
        }
      },
      (error:BlockedResponse) =>
      {
        console.error(error);
      }
    )
  }
  async GetPosts()
  {
    await this.post_svc.GetPostsTopicID(this.topic.topicID).then(
      (data:Post_Response) =>
      {
        for(let item of data.postList)
        {
          var blocked : boolean = false;
          for(let id of this.blocked_id_list)
          {
            
            if(item.userID == id)
            {
              blocked = true;
              console.log("blocked" + id)
              break;
            }
          }
          if(!blocked)
          {
            this.posts.Insert(item);
          }
        }
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
    this.PostListInit();
    this.loading = false;
  }
  OnScroll()
  {
    if(this.posts.first != null)
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
    if(this.posts.first == null)
    {
      this.notEmptyPost = false;
      this.spinner.hide();
      return;
    }
    
    this.AddPostToArray(this.posts.Pop()!);
  } // end function

  PostListInit()
  {
    for (var i = 0; i < 10; i++)
    {
      this.LoadNextPost();
    }
  } // end function
  AddPostToArray(post : Post)
  {
      this.spinner.hide();
      this.notScrollingY = true;
      this.display_posts.push(post);
  } // end function

  //Follow Topic Functions
  ToggleFollow(value : boolean)
  {
    this.followed = value;
    this.follow_but_txt = (this.followed) ? 'Followed' : 'Follow';
  } // end function
  FollowUnfollow()
  {
    if(!this.followed)
    {
      var follow_obj = new UserTopics();
      follow_obj.userID = this.user_id;
      follow_obj.followedTopicID = this.topic.topicID;

      this.top_fol_svc.FollowTopic(follow_obj).then(
        (data:UserTopicResponse) =>
        {
          this.ToggleFollow(data.followed);
          this.relationship_id = data.relationship.userTopicID;
        },
        (error:UserTopicResponse) =>
        {
          console.error(error);
        }
      );
      return;
    }
    else
    {
      this.top_fol_svc.UnfollowTopic(this.relationship_id).then(
        (data:UserTopicResponse) =>
        {
          console.log(data);
          this.ToggleFollow(data.followed);
        },
        (error:UserTopicResponse) =>
        {
          console.log(error);
        }
      )
      return;
    }
  }  // end function
}
