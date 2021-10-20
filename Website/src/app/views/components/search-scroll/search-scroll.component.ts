import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Profile } from 'src/app/models/profile.model';
import { PostSearch } from 'src/app/models/Search/post-search.model';
import { UserSearch } from 'src/app/models/Search/user-search.model';
import { User } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-scroll',
  templateUrl: './search-scroll.component.html',
  styleUrls: ['./search-scroll.component.css']
})
export class SearchScrollComponent implements OnInit {

  constructor(private post_svc : PostService,
              private user_svc : UserService,
              private profile_svc : ProfileService,
              private topic_svc : TopicService,
              private spinner : NgxSpinnerService,) { }

  @Input() search : string;
  search_arr : any[] = [];

  user_id : number = this.user_svc.GetCurrentUserID()!;
  blocked_id_list : number[] = [];

  async ngOnInit()
  {
    this.spinner.show();
    await this.CreateBlockedList();
    this.GetPosts();
    this.GetUsers();
  }
  IsUserSearch(data:UserSearch | PostSearch) : data is UserSearch
  {
    return (data as UserSearch).bio !== undefined;
  }
  GetPosts()
  {
    return this.post_svc.GetPostIds().subscribe(
      async (data:Post_Response) =>
      {
        for(let post of data.postList)
        {
          
          if(!post.delete && !post.privated && this.blocked_id_list.indexOf(post.userID) == -1)
          {
              var user : User = await this.GetPostUser(post.userID);
              var profile : Profile = await this.GetProfileUser(post.userID);
              if(!post.bannerImage)
              {
                
                post.bannerImage = profile.bannerPic;
              }
              var topicName : string ="";
              if(post.topicID)
              {
                topicName = await this.GetTopicName(post.topicID);
              }
              var post_search = new PostSearch();

              post_search.userID = post.userID;
              post_search.postID = post.postID;
              post_search.displayName = user.displayName;
              post_search.topicName = topicName;
              post_search.username = user.username;
              post_search.profilePic = profile.profilePic;
              post_search.bannerImage = post.bannerImage;
              post_search.title = post.title;
              post_search.tone = post.tone;
              post_search.timestamp = post.timestamp;

              
              this.search_arr.push(post_search);
          }
        }
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
  }
  GetUsers()
  {
    return this.user_svc.GetAllUsers().subscribe(
      async (data:User_Response) =>
      {
        for(let user of data.users)
        {
          if(!(this.blocked_id_list.indexOf(user.userID) != -1) && user.emailVerified)
          {
            var user_search = new UserSearch();
            var profile = await this.GetProfileUser(user.userID);
            user_search.displayName = user.displayName;
            user_search.userID = user.userID;
            user_search.username = user.username;
            user_search.bio = profile.bio;
            user_search.profilePic = profile.profilePic;
            this.search_arr.push(user_search);
          }
        }
        this.spinner.hide();
      }
    )
  }
  async GetPostUser(id : number) : Promise<User>
  {
    return await this.user_svc.GetUser(id).then(
      (data:User_Response) =>
      {
        return data.user;
      }
    )
  }
  async GetProfileUser(id : number) : Promise<Profile>
  {
    return await this.profile_svc.GetProfile(id).then(
      (data:ProfileResponse) =>
      {
        return data.profile;
      }
    )
  }
  async GetTopicName (id:number) : Promise<string>
  {
    return await this.topic_svc.GetTopic(id).then(
      (data:TopicResponse) =>
      {
        return data.topic.topicName
      }
    )
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
  
}
