import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { Post_Node } from 'src/app/models/Lists/post_node.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments-user',
  templateUrl: './comments-user.component.html',
  styleUrls: ['./comments-user.component.css']
})
export class CommentsUserComponent implements OnInit {

  constructor(private post_svc : PostService,
              private user_svc : UserService) { }

  @Input() spinner : NgxSpinnerService;
  @Input() userID : number;
  
  comments : Post[] = [];
  comment_node_list : Timestamp_List = new Timestamp_List();

  notScrollingYPosts : boolean = false;
  notEmptyPost : boolean = true;
  
  async ngOnInit() 
  {
    await this.GetComments();
    this.PostListInit();
  }
  async GetComments()
  {
    await this.post_svc.GetPostsUserAndType('Comment:' + this.userID).then(
      (data:Post_Response) =>
      {
        for(let item of data.postList)
        {
          this.comment_node_list.Insert(item);
        }
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
  }
  PostListInit()
  {
    for(var i = 0; i < 8; i++)
    {
      this.LoadNextComment();
    }
  }
   OnScroll()
  {
    if(this.comment_node_list.first != null)
    {
      this.notEmptyPost = true;
    }
    if(this.notScrollingYPosts && this.notEmptyPost)
    {
      this.spinner.show();
      this.notScrollingYPosts = false;
      this.LoadNextComment();
    }
  }
  LoadNextComment()
  {
    if(this.comment_node_list.first == null)
    {
      this.notEmptyPost = false;
      this.spinner.hide();
      return;
    }
    this.AddPostToArray(this.comment_node_list.Pop()!);
  } // end function
  AddPostToArray(post : Post)
  {
      this.spinner.hide();
      this.notScrollingYPosts = true;
      this.comments.push(post);
  } // end function
}
