import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-rebuttals-user',
  templateUrl: './rebuttals-user.component.html',
  styleUrls: ['./rebuttals-user.component.css']
})
export class RebuttalsUserComponent implements OnInit {

  constructor(private post_svc : PostService) { }
  
  post_node_list : Timestamp_List = new Timestamp_List();
  posts : Post[] = [];
  notScrollingYPosts : boolean = true;
  notEmptyPost : boolean = true;

  @Input() spinner : NgxSpinnerService;
  @Input() userID : number;

  async ngOnInit()
  {
    await this.GetRebuttals();
    this.PostListInit();
  }
  
  //Post Functions
  async GetRebuttals()
  {
    await this.post_svc.GetPostsUserAndType("Rebuttal:" + this.userID).then(
      (data:Post_Response) =>
      {
        for(let item of data.postList)
        {
          if(item.delete)
          {
            continue;
          }
          this.post_node_list.Insert(item);
        }
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    );
  }
  PostListInit()
  {
    for (var i = 0; i < 8; i++)
    {
      this.LoadNextPost();
    }
  } // end function
  OnScrollPosts()
  {
    if(this.post_node_list.first != null)
    {
      this.notEmptyPost = true;
    }
    if(this.notScrollingYPosts && this.notEmptyPost)
    {
      this.spinner.show();
      this.notScrollingYPosts = false;
      this.LoadNextPost();
    }
  }
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
  AddPostToArray(post : Post)
  {
      this.spinner.hide();
      this.notScrollingYPosts = true;
      this.posts.push(post);
  } // end function
}

